/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Config } from '@jest/types'
import { findWorkspacePackages, Project } from '@pnpm/workspace.find-packages'
import { defaults } from 'jest-config'
import path from 'path'

let workspaceRoot = path.join(__dirname, '../..')

export async function findPackage(dir: string): Promise<Project | undefined> {
  let packages = await findWorkspacePackages(workspaceRoot)

  return packages.find((pkg) => pkg.dir === dir)
}

export let createDefaultJestConfigFromDir = async (
  dir: string,
): Promise<Config.InitialProjectOptions> => {
  let pkg = await findPackage(dir)

  if (!pkg) {
    throw new Error(`Package ${dir} not found`)
  }

  return createDefaultJestConfig(pkg)
}

export let createDefaultJestConfig = (
  pkg: Project,
): Config.InitialProjectOptions => ({
  rootDir: pkg.dir,
  // roots: ['<rootDir>/src'],
  displayName: {
    name: pkg.manifest.name!,
    color: pkg.dir.includes('service') ? 'cyanBright' : 'cyan',
  },
  testPathIgnorePatterns: ['/dist/'],
  snapshotFormat: {
    printBasicPrototype: false,
  },

  // @ts-ignore
  coverageReporters: ['lcov', 'cobertura', 'text'],
  coverageDirectory: '<rootDir>/artifacts/coverage',

  // // @ts-ignore
  // coverageDirectory: path.join(pkg.dir, 'artifacts/coverage'),
  // `preset` fehlt in den Types von `InitialProjectOptions`

  // @ts-ignore
  preset: 'ts-jest',
})

let config: () => Promise<Config.InitialOptions> = async () => {
  let packages = await findWorkspacePackages(workspaceRoot)

  // let projects = packages
  //   .filter((pkg) => pkg.manifest.name !== '@embetty/monorepo')
  //   .map((pkg) => pkg.dir)
  //   .filter((dir) => fs.existsSync(path.join(dir, 'jest.config.ts')))
  //   .map((dir) => `<rootDir>/${path.relative(workspaceRoot, dir)}`)
  // // .map((dir) => require(dir))

  // let projects = await Promise.all(
  //   packages
  //     .filter((pkg) => pkg.manifest.name !== '@embetty/monorepo')
  //     .map((pkg) => path.join(pkg.dir, 'jest.config.ts'))
  //     .filter((configFile) => fs.existsSync(configFile))
  //     .map((configFile) => `./${path.relative(workspaceRoot, configFile)}`)
  //     .map((configFile) =>
  //       require(configFile),
  //     ) as unknown as Promise<Config.InitialProjectOptions>[],
  // )

  // console.log({ projects })

  let projects: Config.InitialProjectOptions[] = packages
    .filter((pkg) => pkg.manifest.name !== '@embetty/monorepo')
    .map((pkg) => createDefaultJestConfig(pkg))

  let config: Config.InitialOptions = {
    coveragePathIgnorePatterns: [
      ...defaults.coveragePathIgnorePatterns,
      'libs/testing',
      '.dto.ts$',
    ],

    // https://kulshekhar.github.io/ts-jest/docs/26.5/guides/using-with-monorepo/
    projects,
    // coverageReporters: ['text', 'lcov'],
    // modulePathIgnorePatterns: ['/dist/'],
    preset: 'ts-jest',
    // testPathIgnorePatterns: [...defaults.testPathIgnorePatterns, '/dist/'],

    // TODO: unit-test-config
    reporters: [
      'default',
      [
        'jest-junit',
        {
          outputDirectory: '<rootDir>/artifacts',
          outputName: 'junit.test.xml',
          uniqueOutputName: 'false',
          suiteNameTemplate: '{filename}',
          classNameTemplate: '{classname}',
          titleTemplate: '{title}',
          ancestorSeparator: ' › ',
        },
      ],
    ],
    coverageReporters: ['lcov', 'cobertura', 'text'],
    coverageDirectory: '<rootDir>/artifacts/coverage',
  }

  // console.log(config)

  return config
}

export default config
