
class Utils {
    public static isStringEmpty(obj: any): boolean {
        if (typeof obj === "undefined" || obj === null || obj === "") {
            return true;
        } else {
            return false;
        }
    }

    public static exportContentToClipboard(content: string) {
        let transfer = document.createElement('textarea');
        // 不这么设置屏幕会跳，具体哪儿有问题还没确定
        transfer.style.cssText = "width:30%;padding:2%;min-width: 100px;opacity: 0.5;color: rgb(255, 255, 255);line-height: 18px;text-align: center;border-radius: 5px;position: fixed;top: 50%;left: 30%;z-index: 999999;background: rgb(0, 0, 0);font-size: 15px;";
        document.body.appendChild(transfer);
        transfer.value = content;  // 这里表示想要复制的内容
        transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        transfer.blur();
        document.body.removeChild(transfer);
    }

    public static generateId():number {
        return Utils.getCurrentTimeMs()
    }

    public static getCurrentTimeMs():number {
        return (new Date()).getTime()
    }
}

export default Utils