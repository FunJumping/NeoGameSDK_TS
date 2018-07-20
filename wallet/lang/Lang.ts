namespace BlackCat {
    export class LangBase {

        lang: any;

        get(key: string) {
            if (this.lang.hasOwnProperty(key)) {
                return this.lang[key]
            }
            return "";
        }

    }
}