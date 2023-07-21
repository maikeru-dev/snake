class Configuration {
    protected readonly : boolean;
    protected configuration : Map<String, any>;
    constructor(FILE_PATH : string, readonly : boolean) {
        this.readonly = readonly;

        // let file = new File(null, FILE_PATH); // exists method apparently doesn't exist, lets figure this out later
        // // TODO: FIGURE OUT HOW TO MAKE THIS SAFER !
        //
        // file.text().then(content => {
        //     // ON SUCCESS
        //     this.configuration = JSON.parse(content);
        // }); // REJECTION AUTOMATICALLY THROWS AN ERROR#
        this.configuration = new Map<String, any>;
    }
    public static getFile(FILE_PATH : string) : Configuration {
        return new Configuration(FILE_PATH, true);
    }
    public static has(keys : string[], config : Configuration) : boolean {
        return config.getKeys().filter(
            (value): boolean => { return keys.indexOf(value) != -1; }
        ).length == keys.length;
    }
    public getKeys(): string[] {
        let keyArray : string[] = [];
        if (this.configuration.size == 0) return keyArray;

        this.configuration.forEach( (value, key) => {
            keyArray.push(key.toString());
        })
        return keyArray;
    }
    public setValue(key : String, value : any) : boolean {
        if (this.readonly) {
            return false;
        }
        this.configuration.set(key, value);
        return true;
    }
    public getValue(key : string) : any {
        if (this.configuration.has(key)) {
            return this.configuration.get(key);
        }
        return null;
    }
}