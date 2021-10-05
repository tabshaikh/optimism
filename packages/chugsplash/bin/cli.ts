import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import dotenv from 'dotenv'
import fs from 'fs'

import { makeActionBundleFromConfig } from '../src'

yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command(
    'bundle',
    'Bundle the chugsplash deployment file',
    (yargz) => {
      return yargz
        .option('deployment', {
          describe: 'Path to the deployment file',
          type: 'string',
          demandOption: true,
        })
        .option('env', {
          describe: 'Path to an environment file to load',
          type: 'string',
        })
    },
    async (argv) => {
      if (!fs.existsSync(argv.deployment)) {
        throw new Error(`could not load deployment file: ${argv.deployment}`)
      }

      if (argv.env) {
        if (!fs.existsSync(argv.env)) {
          throw new Error(`could not load environment file: ${argv.env}`)
        }

        dotenv.config({
          path: argv.env,
        })
      }

      // Load the configuration file.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const config = JSON.parse(
        fs.readFileSync(argv.deployment, { encoding: 'utf8' })
      )

      // Turn the configuration file into a chugsplash bundle.
      const bundle = await makeActionBundleFromConfig(config, process.env)

      console.log(bundle)
    }
  )
  .parse()
