import { AxiosRequestConfig } from 'axios'
import crypto from 'crypto'

export let env = (key: string) => {
  let value = process.env[key]

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value
}

// /!\ TODO FIXME sort recursively
export let stringify = (object: object) =>
  JSON.stringify(object, Object.keys(object).sort())

export let hash = (object: object) => {
  let sha256 = crypto.createHash('sha256')
  sha256.update(stringify(object))
  return sha256.digest('base64').toString()
}

export let hashRequest = ({ url }: AxiosRequestConfig) => hash({ url })
