// Local, network-free orchestration regression tests. No server commands execute.
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const bash = process.env.TEST_BASH || 'bash';
const script = resolve('deploy/deploy-cloud.sh').replaceAll('\\', '/');
const release = `${'a'.repeat(40)}-123000001`;
const fixture = mkdtempSync(join(tmpdir(), 'tripeer-cloud-test-'));
const posix = p => p.replaceAll('\\', '/');
const bin = join(fixture, 'bin');
mkdirSync(bin);
const mock = (name, source) => writeFileSync(join(bin, name), `#!/usr/bin/env bash\nset -eu\n${source}\n`, { mode: 0o755 });
mock('ssh', `
command="\${!#}"
printf '%s\\n' "$command" >> "$TEST_CALLS"
case "$command" in
  'bash -se')
    cat >/dev/null
    [[ "$TEST_SCENARIO" != preflight-failure ]] || exit 255
    ;;
  mktemp*)
    if [[ "$TEST_SCENARIO" == unsafe-stage ]]; then echo /var/www/tripeer; else echo "/tmp/tripeer-upload-$RELEASE_ID.ABCDef12"; fi
    ;;
  'bash -se -- '*)
    body=$(cat)
    if [[ "$body" == *'sudo -n /usr/local/sbin/tripeer-deploy'* ]]; then
      echo ACTIVATE >> "$TEST_CALLS"
      [[ "$TEST_SCENARIO" != activation-failure ]] || exit 1
    else
      echo SEED >> "$TEST_CALLS"
      [[ "$TEST_SCENARIO" != seed-failure ]] || exit 1
    fi
    ;;
  'rm -rf -- '*) echo CLEANUP >> "$TEST_CALLS" ;;
  *) echo "Unexpected SSH command: $command" >&2; exit 99 ;;
esac`);
mock('rsync', `
printf 'RSYNC %s\\n' "$*" >> "$TEST_CALLS"
[[ "$TEST_SCENARIO" != upload-failure ]] || exit 30
echo 'Total bytes sent: 512'
echo 'Total transferred file size: 1000'`);
mock('curl', `
echo PUBLIC_CHECK >> "$TEST_CALLS"
if [[ "$TEST_SCENARIO" == wrong-public-version ]]; then echo old-version; else echo "$RELEASE_ID"; fi`);

let count = 0;
try {
  for (const scenario of ['success', 'preflight-failure', 'unsafe-stage', 'seed-failure', 'upload-failure', 'activation-failure', 'wrong-public-version', 'invalid-id', 'wrong-build-version']) {
    const dir = join(fixture, scenario);
    mkdirSync(join(dir, 'dist', 'assets'), { recursive: true });
    writeFileSync(join(dir, 'dist', 'index.html'), '<html>test</html>');
    writeFileSync(join(dir, 'dist', 'deploy-version.txt'), scenario === 'wrong-build-version' ? 'old' : release);
    const calls = join(dir, 'calls');
    writeFileSync(calls, '');
    const result = spawnSync(bash, ['-c', 'if command -v cygpath >/dev/null; then TEST_BIN=$(cygpath -u "$TEST_BIN"); fi; export PATH="$TEST_BIN:$PATH"; exec bash "$TEST_SCRIPT" "$TEST_DIST"'], {
      encoding: 'utf8', timeout: 15000,
      env: { ...process.env, TEST_BIN: posix(bin), TEST_SCRIPT: script, TEST_DIST: posix(join(dir, 'dist')),
        TEST_CALLS: posix(calls), TEST_SCENARIO: scenario, RELEASE_ID: scenario === 'invalid-id' ? '../bad' : release,
        SSH_KEY: '/tmp/test-key', SSH_KNOWN_HOSTS: '/tmp/test-known-hosts', GITHUB_STEP_SUMMARY: '' }
    });
    assert.ifError(result.error);
    const log = readFileSync(calls, 'utf8');
    assert.equal(result.status === 0, scenario === 'success', `${scenario}: ${result.stdout}\n${result.stderr}`);
    const allocated = !['preflight-failure', 'unsafe-stage', 'invalid-id', 'wrong-build-version'].includes(scenario);
    assert.equal(log.includes('CLEANUP'), allocated, `${scenario}: cleanup target handling`);
    const activates = ['success', 'activation-failure', 'wrong-public-version'].includes(scenario);
    assert.equal(log.includes('ACTIVATE'), activates, `${scenario}: activation must not follow failed upload`);
    assert.equal(log.includes('PUBLIC_CHECK'), ['success', 'wrong-public-version'].includes(scenario));
    assert.ok(!log.includes('scp '));
    if (scenario === 'success') {
      assert.match(log, /--checksum/);
      assert.match(log, /--stats/);
      assert.match(log, /--timeout=60/);
      assert.match(log, /--delete-delay/);
      assert.ok(!log.includes('--inplace'));
      assert.match(log, /ubuntu@124\.220\.2\.69:\/tmp\/tripeer-upload-/);
      assert.ok(log.indexOf('SEED') < log.indexOf('RSYNC'));
      assert.ok(log.indexOf('RSYNC') < log.indexOf('ACTIVATE'));
    }
    console.log(`PASS ${scenario}`);
    count++;
  }
  const workflow = readFileSync('.github/workflows/deploy-tencent-cloud.yml', 'utf8');
  assert.match(workflow, /runs-on: ubuntu-latest/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /self-hosted|upload-artifact|workflow_run:|^  push:/m);
  assert.match(workflow, /event: 'push', status: 'success'/);
  assert.match(workflow, /ref: \$\{\{ steps.source.outputs.sha \}\}/);
  console.log(`PASS workflow invariants; ${count} orchestration scenarios passed`);
  // Exercise the exact inline GitHub API selection code without calling GitHub.
  const inline = workflow.match(/          script: \|\n([\s\S]*?)\n      - name:/)[1]
    .split('\n').map(line => line.replace(/^ {12}/, '')).join('\n');
  const select = new (Object.getPrototypeOf(async function () {}).constructor)('github', 'context', 'core', inline);
  const context = { repo: { owner: 'cqz-cio', repo: 'TEIPEER-WEB' }, runId: 123 };
  const valid = { head_repository: { full_name: 'cqz-cio/TEIPEER-WEB' }, head_branch: 'main',
    conclusion: 'success', head_sha: 'a'.repeat(40), run_number: 1, html_url: 'https://github.com/example' };
  const previousAttempt = process.env.GITHUB_RUN_ATTEMPT;
  process.env.GITHUB_RUN_ATTEMPT = '1';
  try {
    for (const run of [valid, undefined, { ...valid, head_branch: 'feature' },
      { ...valid, conclusion: 'failure' }, { ...valid, head_repository: { full_name: 'outside/repo' } },
      { ...valid, head_sha: '../unsafe' }]) {
      const outputs = {};
      const summary = { addHeading() { return this; }, addLink() { return this; }, addRaw() { return this; }, async write() {} };
      const core = { setOutput: (k, v) => { outputs[k] = v; }, summary };
      const github = { rest: { actions: { async listWorkflowRuns(query) {
        assert.equal(query.branch, 'main');
        assert.equal(query.event, 'push');
        assert.equal(query.status, 'success');
        assert.equal(query.workflow_id, 'ci.yml');
        return { data: { workflow_runs: run ? [run] : [] } };
      } } } };
      if (run === valid) {
        await select(github, context, core);
        assert.equal(outputs.sha, valid.head_sha);
        assert.equal(outputs.release, release);
      } else {
        await assert.rejects(select(github, context, core), /No valid successful/);
      }
    }
    console.log('PASS 6 CI revision selection scenarios');
  } finally {
    if (previousAttempt === undefined) delete process.env.GITHUB_RUN_ATTEMPT;
    else process.env.GITHUB_RUN_ATTEMPT = previousAttempt;
  }
} finally {
  // mkdtemp-owned test fixtures only.
  rmSync(fixture, { recursive: true, force: true });
}
