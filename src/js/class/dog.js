export default class Dog{
    constructor(name) {
        this.name = name;
        console.log('dog crddddée');

        console.log(Math.random() * 10)
    }

    bark() {
        return `xsdd ${this.name}`;
    }
}