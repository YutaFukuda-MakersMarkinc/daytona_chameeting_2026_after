import imagemin from "imagemin-keep-folder";
import imageminMozjpeg from "imagemin-mozjpeg";
import imageminPngquant from "imagemin-pngquant";
import imageminGifsicle from "imagemin-gifsicle";
import imageminSvgo from "imagemin-svgo";

imagemin(['src/images/**/*.{jpg,jpeg,png,gif,svg,ico,pdf,mp4}'], {
    plugins: [
        imageminMozjpeg({ quality: 90 }),
        imageminPngquant({ quality: [0.7, 0.9] }),
        imageminGifsicle(),
        imageminSvgo()
    ],
    replaceOutputDir: output => {
        return output.replace(/images\//, '../dist/images/')
    }
}).then(() => {
    console.log('Images optimized');
});