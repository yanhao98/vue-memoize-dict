import { execSync } from 'node:child_process'
import path from 'node:path'

execSync('npm run build', { stdio: 'inherit' })

let command = 'npm publish --access public'

/* if (version.includes('beta'))
  command += ' --tag beta' */

execSync(command, { stdio: 'inherit', cwd: path.join('packages', 'vue-memoize-dict') })
