import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

execSync('npm run build', { stdio: 'inherit' })

const entry = readFileSync('dist/index.d.ts', 'utf8')
const requiredExports = [
  'generateAeoV3',
  'buildBusinessFactGraph',
  'buildTrafficAssetIR',
  'compileAssets'
]

for (const name of requiredExports) {
  if (!entry.includes(name)) {
    throw new Error(`Missing exported symbol: ${name}`)
  }
}

console.log('AEO-reach core smoke test passed.')
