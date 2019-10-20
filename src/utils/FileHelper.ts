import Utils from './Utils'
import { Note } from '../model/MainModel'

const fs = window.require('fs')
const dir = '/Users/bear/Documents/MindEditor/test2/'
const { shell } = window.require("electron").remote;

function getNotePath(note: Note): string {
    return dir + note.id + '.md'
}

const isLogDetail = true
function fileLog(content: string, isImportant: boolean = false) {
    if (isLogDetail || isImportant) {
        console.log(content)
    }
}

const fileHelper = {
    /**
     * 文件不存在不是error，文件存在但读取失败是error
     */
    readNote: (note: Note, onResult: (isError: boolean, contentOrErrorMsg: string) => void) => {
        const path = getNotePath(note)
        fileLog("Read file start " + note.toString())

        if (fs.existsSync(path)) {
            fs.readFile(path, { encoding: 'utf8' }, function (err: any, data: string) {
                if (!err) {
                    // 牛逼了，这里的data的类型居然是Unit8Array，然后你直接用log+string打还看不出来，直接打印才能看出来，然后最后用还得转型，所以这个ts还是不太安全啊。而且在这个项目里看错误栈还看不出来，真的是恶心
                    // console.log("render content 2" + data)
                    // console.log(data)
                    fileLog(`Read file success ${note.toString()} data:${data.toString()}`)
                    onResult(false, data.toString())
                } else {
                    const errorMsg = `Read file failed ${note.toString()}`
                    fileLog(errorMsg, true)
                    onResult(true, errorMsg)
                }
            })
        } else {
            fileLog("Read file failed, not exist, path:" + path)
            onResult(false, "")
        }
    },
    saveNote: (note: Note, content: string, onResult: (isSuccess: boolean) => void) => {
        fs.writeFile(getNotePath(note), content, { encoding: 'utf8' }, function (err: any) {
            if (!err) {
                console.log(`保存 Note ${note.toString()} 成功`)
                onResult(true)
            } else {
                console.log(`保存 Note ${note.toString()} 失败 Error:${err}`)
                onResult(false)
            }
        })
    },
    saveImage: (image: File, onResult: (isSuccess: boolean, formatPathOrErrorMsg: string) => void) => {
        // todo 目前就限制是jpg了
        const imageName = `${Utils.getCurrentTimeMs()}.jpg`
        const path = `${dir}image/${imageName}`
        const formatPath = `file:///${path}`

        const reader = new FileReader();
        reader.readAsArrayBuffer(image)
        reader.onload = function (e) {
            const buffer = reader.result;
            if (buffer instanceof ArrayBuffer) {
                fs.writeFile(path, new DataView(buffer), function (err: any) {
                    if (!err) {
                        console.log(`保存图片 ${imageName} 成功`)
                        onResult(true, formatPath)
                    } else {
                        const errorMsg = `保存图片 ${imageName} 失败`
                        console.log(errorMsg)
                        onResult(false, errorMsg)
                    }
                })
            }
        }
    },
    openDir: () => {
        shell.showItemInFolder(dir);
    }
    //   renameFile: (path, newPath) => {
    //     return fs.rename(path, newPath)
    //   },
    //   deleteFile: (path) => {
    //     return fs.unlink(path)
    //   }
}

export default fileHelper