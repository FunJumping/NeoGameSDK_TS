namespace BlackCat {
    export class Connector {

        private hosts: Array<string>;

        private first_host: string;
        private check_params: string;

        private fetch_error: Array<string>;

        constructor(hosts: Array<string>, check_params: string) {
            this.hosts = hosts
            this.check_params = check_params

            this.fetch_error = []
        }

        getOne(callback) {
            try {
                var protocol = ""
                if (window.location.protocol == "file:") {
                    protocol = "http:"
                }
                this.hosts.forEach(
                    host => {
                        let url_head = ""
                        if (host.substr(0,2) === "//") {
                            url_head = protocol
                        }
                        let url = url_head + host + this.check_params

                        fetch(url).then(
                            response => {
                                if (response.ok) {
                                    if (!this.first_host) {
                                        this.first_host = url_head + host
                                        callback(this.first_host)
                                    }
                                }
                                else {
                                    this.fetch_error.push(host)
                                }
                            },
                            error => {
                                this.fetch_error.push(host)
                                console.log('[Bla Cat]', '[Connector]', 'getOne, fetch err => ', error)
                            }
                        )
                        
                    }
                )
            }
            catch (e) {
                console.log('[Bla Cat]', '[Connector]', 'getOne, error => ', e.toString())
            }

            // setTimeout(() => {
            //     if (!this.first_host) {
            //         callback(false)
            //     }
            // }, 5000)

            this.check_results(callback)
        }

        private check_results(callback) {
            console.log('[Bla Cat]', '[Connector]', 'do check_results ...')
            setTimeout(() => {
                if (!this.first_host) {
                    if (this.fetch_error.length == this.hosts.length) {
                        console.log('[Bla Cat]', '[Connector]', 'check_results, all fetch_error => ', this.fetch_error)
                        callback(false)
                    }
                    else {
                        this.check_results(callback)
                    }
                }
            }, 500)
        }
    }
}