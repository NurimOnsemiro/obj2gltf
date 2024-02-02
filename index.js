const yargs = require('yargs')
const {hideBin} = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv
const path = require('path')
const fsPromise = require('fs/promises')
const obj2gltf = require('obj2gltf')

async function convertObj2Gltf(filePath, fileOutputPath) {
  const gltf = await obj2gltf(filePath, {
    secure: true,
    checkTransparency: true,
    separate: true,
    outputDirectory: path.dirname(fileOutputPath)
  })
  const data = Buffer.from(JSON.stringify(gltf, null, 2))
  await fsPromise.writeFile(fileOutputPath, data)
}

async function main() {
  let filePath = ''
  const folderName = argv['folder-name']
  if (folderName != null) {
    filePath += `${folderName}/`
  }
  const fileName = argv['file-name']
  if (fileName != null) {
    filePath += fileName
  }
  const extName = (argv['ext-name'] ?? 'obj').toLowerCase()
  filePath += `.${extName}`

  const outputPath = argv['output-path']

  console.log(filePath)
  console.log(outputPath)

  const originalFilePath = path.join(process.cwd(), filePath)

  try {
    await convertObj2Gltf(originalFilePath, outputPath)
  } catch (err) {
    console.error(err)
  }
}
main()