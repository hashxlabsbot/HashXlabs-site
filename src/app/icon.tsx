import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default async function Icon() {
  const img = await readFile(`${process.cwd()}/public/favicon/logo.png`)
  const base64 = `data:image/png;base64,${img.toString('base64')}`

  return new ImageResponse(
    <img src={base64} style={{ width: 512, height: 512 }} />,
    { width: 512, height: 512 }
  )
}
