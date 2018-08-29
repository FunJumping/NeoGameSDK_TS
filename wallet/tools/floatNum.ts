namespace BlackCat {
    export class floatNum {
        /**
         * @file 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
         * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
         */

        /**
         * 把错误的数据转正
         * strip(0.09999999999999998)=0.1
         */
        static strip(num: number, precision = 12): number {
            return +parseFloat(num.toPrecision(precision));
        }

        /**
         * Return digits length of a number
         * @param {*number} num Input number
         */
        static digitLength(num: number): number {
            // Get digit length of e
            const eSplit = num.toString().split(/[eE]/);
            const len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
            return len > 0 ? len : 0;
        }

        /**
         * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
         * @param {*number} num 输入数
         */
        static float2Fixed(num: number): number {
            if (num.toString().indexOf('e') === -1) {
                return Number(num.toString().replace('.', ''));
            }
            const dLen = floatNum.digitLength(num);
            return dLen > 0 ? num * Math.pow(10, dLen) : num;
        }

        /**
         * 检测数字是否越界，如果越界给出提示
         * @param {*number} num 输入数
         */
        static checkBoundary(num: number) {
            if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
                console.warn(`${num} is beyond boundary when transfer to integer, the results may not be accurate`);
            }
        }

        /**
         * 精确乘法
         */
        static times(num1: number, num2: number, ...others: number[]): number {
            if (others.length > 0) {
                return floatNum.times(floatNum.times(num1, num2), others[0], ...others.slice(1));
            }
            const num1Changed = floatNum.float2Fixed(num1);
            const num2Changed = floatNum.float2Fixed(num2);
            const baseNum = floatNum.digitLength(num1) + floatNum.digitLength(num2);
            const leftValue = num1Changed * num2Changed;

            floatNum.checkBoundary(leftValue);

            return leftValue / Math.pow(10, baseNum);
        }

        /**
         * 精确加法
         */
        static plus(num1: number, num2: number, ...others: number[]): number {
            if (others.length > 0) {
                return floatNum.plus(floatNum.plus(num1, num2), others[0], ...others.slice(1));
            }
            const baseNum = Math.pow(10, Math.max(floatNum.digitLength(num1), floatNum.digitLength(num2)));
            return (floatNum.times(num1, baseNum) + floatNum.times(num2, baseNum)) / baseNum;
        }

        /**
         * 精确减法
         */
        static minus(num1: number, num2: number, ...others: number[]): number {
            if (others.length > 0) {
                return floatNum.minus(floatNum.minus(num1, num2), others[0], ...others.slice(1));
            }
            const baseNum = Math.pow(10, Math.max(floatNum.digitLength(num1), floatNum.digitLength(num2)));
            return (floatNum.times(num1, baseNum) - floatNum.times(num2, baseNum)) / baseNum;
        }

        /**
         * 精确除法
         */
        static divide(num1: number, num2: number, ...others: number[]): number {
            if (others.length > 0) {
                return floatNum.divide(floatNum.divide(num1, num2), others[0], ...others.slice(1));
            }
            const num1Changed = floatNum.float2Fixed(num1);
            const num2Changed = floatNum.float2Fixed(num2);
            floatNum.checkBoundary(num1Changed);
            floatNum.checkBoundary(num2Changed);
            return floatNum.times((num1Changed / num2Changed), Math.pow(10, floatNum.digitLength(num2) - floatNum.digitLength(num1)));
        }

        /**
         * 四舍五入
         */
        static round(num: number, ratio: number): number {
            const base = Math.pow(10, ratio);
            return floatNum.divide(Math.round(floatNum.times(num, base)), base);
        }

        /**
         * 小数位不够，用0补足位数
         * @param num 要处理的数字
         * @param ratio 生成的小数位数
         */
        static addZero(num: number, ratio: number): string {
            var s_x = num.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }
            while (s_x.length <= pos_decimal + ratio) {
                s_x += '0';
            }
            return s_x;
        }
    }
}

