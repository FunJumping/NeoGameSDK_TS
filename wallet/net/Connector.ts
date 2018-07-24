namespace BlackCat {
    export class Connector {

        private hosts: Array<string>;

        private first_host: string;
        private check_params: string;

        constructor(hosts: Array<string>, check_params: string) {
            this.hosts = hosts
            this.check_params = check_params
        }

        async getOne() {
            try {
                this.hosts.forEach(
                    host => {
                        fetch(host + this.check_params).then(
                            response => {
                                if (response.ok && this.first_host == "") {
                                    this.first_host = host
                                }
                            }
                        )
                    }
                )
            }
            catch (e) {

            }
            return await this.checkFirst(0)
        }

        async checkFirst(count) {
            count += 1;
            if (count >= 30) {
                return ""
            }

            await setTimeout( async () => {
                if (this.first_host) {
                    return this.first_host
                }
                else {
                    await this.checkFirst(count)
                }
            }, 100)
        }

    }
}