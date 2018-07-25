namespace BlackCat {
    export class Connector {

        private hosts: Array<string>;

        private first_host: string;
        private check_params: string;

        constructor(hosts: Array<string>, check_params: string) {
            this.hosts = hosts
            this.check_params = check_params
        }

        getOne(callback) {
            try {
                this.hosts.forEach(
                    host => {
                        fetch(host + this.check_params).then(
                            response => {
                                if (response.ok && !this.first_host) {
                                    this.first_host = host
                                    callback(this.first_host)
                                }
                            }
                        )
                    }
                )
            }
            catch (e) {

            }

            setTimeout(() => {
                if (!this.first_host) {
                    callback(false)
                }
            }, 2000)
        }
    }
}