import { getCompliance, close } from 'accessibility-checker';
import { execSync } from 'child_process';
import { resolve } from 'path';

async function main() {
    const publicDir = resolve('public');
    const output = execSync(`find "${publicDir}" -name "*.html"`).toString().trim();
    const EXCLUDE = ['/admin/', '/data/', '/news/page/', '/events/page/'];

    const files = output.split('\n').filter(f => f && !EXCLUDE.some(ex => f.includes(ex)));

    if (files.length === 0) {
        console.error('No HTML files found in public/. Run hugo first.');
        process.exit(1);
    }

    console.log(`Scanning ${files.length} pages...\n`);

    let passed = 0;
    let failed = 0;
    let errored = 0;

    for (const file of files) {
        try {
            const result = await getCompliance(`file://${file}`, file);
            const violations = result?.report?.summary?.counts?.violation ?? 0;

            if (violations === 0) {
                passed++;
            } else {
                failed++;
                console.log(`FAILED: ${file} (${violations} violation${violations !== 1 ? 's' : ''})`);
            }
        } catch (err) {
            errored++;
            console.log(`ERROR: ${file} — ${err.message}`);
        }
    }

    await close();

    const total = passed + failed + errored;
    console.log(`\n${passed} of ${total} passed.${errored > 0 ? ` (${errored} errored)` : ''}`);

    if (failed > 0 || errored > 0) {
        process.exit(1);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
