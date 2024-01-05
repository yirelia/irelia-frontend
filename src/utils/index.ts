/*!
 * \brief Utilities::convertMMToPixel
 * Converts the value from mm to pixels
 * pixel = (dpi * mm / 1 inch)
 * 1 inch is 25.4
 * \param value
 * \return
 */
export function convertMMToPixel(value: number){
   return (YsScreen.logicalDpiX() * value ) / 25.4
}

class YsScreen {
    private static dpiVal = 0
    public static logicalDpiX(noCache?: boolean) {
        if (noCache || YsScreen.dpiVal == 0) {
            const el = document.body.appendChild(document.createElement('DIV'));
            el.style.width = '1in';
            el.style.padding = '0';
            this.dpiVal = el.offsetWidth;
            el.parentNode?.removeChild(el);
         }
         return YsScreen.dpiVal;
    }
}