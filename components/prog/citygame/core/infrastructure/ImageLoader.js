export class ImageLoader {
    static load(image) {
        if (image.complete) {
            return;
        }
        image.src = image.src;
    }

    // load from path
    static loadFromPath(path) {
        const image = new Image();
        image.src = path;
        return image;
    }
}