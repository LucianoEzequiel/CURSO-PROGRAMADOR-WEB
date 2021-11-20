var express = require("express");
var router = express.Router();
var novedadesModels = require("./../../models/novedadesModels");
var util = require("util");
var cloudinary = require("cloudinary").v2;
var uploader = util.promisify(cloudinary.uploader.upload);
var destroy = util.promisify(cloudinary.uploader.destroy);

/* GET home page. */
router.get("/", async function (req, res, next) {
    /* var novedades = await novedadesModels.getNovedades(); */

    var novedades;
    if (req.query.q === undefined) {
        novedades = await novedadesModels.getNovedades();
    } else {
        novedades = await novedadesModels.buscarNovedades(req.query.q);
    }

    novedades = novedades.map((novedad) => {
        if (novedad.img_id) {
            var imagen = cloudinary.image(novedad.img_id, {
                width: 100,
                height: 100,
                crop: "fill",
            });
            return {
                ...novedad,
                imagen,
            };
        } else {
            return {
                ...novedad,
                imagen: "",
            }
        }
    });

    res.render("admin/novedades", {
        layout: "admin/layout",
        usuario: req.session.nombre,
        novedades,
        is_search: req.query.q !== undefined,
        q: req.query.q,
    });
});

/*para eliminar una novedad*/
router.get("/eliminar/:id", async (req, res, next) => {
    var id = req.params.id;
    var novedad = await novedadesModels.getNovedadById(id);
    if (novedad.img_id) {
        await (destroy(novedad.img_id));
    }
    await novedadesModels.deleteNovedadesById(id);
    res.redirect("/admin/novedades")
});

router.get("/agregar", (req, res, next) => {
    res.render("admin/agregar", {
        layout: "admin/layout",
    });
});

router.post("/agregar", async (req, res, next) => {
    var img_id = "";
    if (req.files && Object.keys(req.files).length > 0) {
        imagen = req.files.imagen;
        img_id = (await uploader(imagen.tempFilePath)).public_id;
    }
    try {
        if (
            req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await novedadesModels.insertNovedad({
                ...req.body,
                img_id
            });
            res.redirect("/admin/novedades");
        } else {
            res.render("admin/agregar", {
                layout: "admin/layout",
                error: true,
                message: "Todos los campos son obligatorios",
            });
        }
    } catch (error) {
        console.log(error);
        res.render("admin/agregar", {
            layout: "admin/layout",
            error: true,
            message: "Error al agregar la novedad",
        });
    }
});

router.get("/modificar/:id", async (req, res, next) => {
    var id = req.params.id;
    var novedad = await novedadesModels.getNovedadById(id);
    res.render("admin/modificar", {
        layout: "admin/layout",
        novedad,
    });
});

router.post("/modificar", async (req, res, next) => {
    try {
        var img_id = req.body.img_original;
        var borrar_img_vieja = false;
        if (req.body.img_delete === "1") {
            img_id = null;
            borrar_img_vieja = true;
        } else {
            if (req.files && Object.keys(req.files).length > 0) {
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePath)).public_id;
                borrar_img_vieja = true;
            }
        }
        if (borrar_img_vieja && req.body.img_original) {
            await (destroy(req.body.img_original));
        }

        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo: req.body.cuerpo,
            img_id
        }
        console.log(obj);
        await novedadesModels.modificarNovedadById(obj, req.body.id);
        res.redirect("/admin/novedades");
        } catch (error) {
        console.log(error);
        res.render("admin/modificar", {
            layout: "admin/layout",
            error: true,
            message: "No se modifico la novedad",
        });
    }
});

module.exports = router;
