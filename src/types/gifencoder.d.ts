declare module "gifencoder" {
    // Type definitions for gifencoder 2.0
    // Project: https://github.com/eugeneware/gifencoder#readme
    // Definitions by: Carlos Precioso <https://github.com/cprecioso>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
    //* modified by me

    /// <reference types="node" />
    import { Readable, Transform } from "stream";

    declare class GIFEncoder {
        constructor(width: number, height: number);

        createReadStream(): Readable;
        createWriteStream(options: GIFEncoder.GIFOptions): Transform;

        start(): void;
        setRepeat(
            /** 0 for repeat, -1 for no-repeat */
            repeat: number
        ): void;
        setDelay(/** frame delay in ms */ delay: number): void;
        setQuality(/** image quality. 10 is default */ quality: number): void;
        addFrame(ctx: CanvasRenderingContext2D): void;
        finish(): void;

        out: GIFEncoder.ByteArray;
    }

    declare namespace GIFEncoder {
        interface GIFOptions {
            /** 0 for repeat, -1 for no-repeat */
            repeat: number;
            /** frame delay in ms */
            delay: number;
            /** image quality. 10 is default */
            quality: number;
        }

        interface ByteArray {
            getData: () => Buffer;
        }
    }

    export = GIFEncoder;
}
