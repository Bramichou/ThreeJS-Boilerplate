export default class Dog{
    constructor(name) {
        this.name = name;
    }

    bark() {
        return `Waf waf, je suis ${this.name}`;
    }
}