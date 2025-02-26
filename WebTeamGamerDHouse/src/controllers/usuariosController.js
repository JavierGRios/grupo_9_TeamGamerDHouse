const path =require('path');
const { validationResult }= require('express-validator');
const bcryptjs =require('bcryptjs');
const db= require('../../database/models/index');





const usuarioController = {
    index: (req,res) => {
        res.render(path.join(__dirname,'../views/users/index.ejs'));
    },
    
    
    // controler de ruta de registro

    register: (req,res) => {
        res.render(path.join(__dirname, '../views/users/register.ejs'));

    },

    // registrar usuario en la DB incluye Validacion de campos

    usuarioRegistrado: async ( req, res)=>{
        
        
        let userInDB = await db.Usuario.findOne({
            where:{email: req.body.email }})
        
        if(userInDB){

           return res.render(path.join(__dirname, '../views/users/register.ejs'),{
                errors:{
                    email:{
                        msg:'Este usuario ya fue registrado'

                    }
                },
                old:req.body    
            });
            
        }    
        
        const errores = validationResult(req);

        
        if(errores.isEmpty()){

            db.Usuario.create({
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                email: req.body.email,
                contraseña: bcryptjs.hashSync(req.body.password),
                imagenusuario: req.file ? req.file.filename : productImage
                ,
                pais: req.body.pais,
                ciudad: req.body.ciudad,
                calle: req.body.calle,
                numero: req.body.numero
            });
    
         return res.redirect('login');
            
        }else{

            res.render(path.join(__dirname, '../views/users/register.ejs'),{
                errors:errores.mapped(),
                old:req.body    
            });
       }

       
    },
    
    // Busqueda de todos los usuarios
      

    listadeUsuarios :(req,res)=>{

        db.Usuario.findAll()
            .then(usuarios =>{
                return res.render(path.join(__dirname,'../views/users/listadeusuarios.ejs'),{usuarios:usuarios});
            })
            console.log(req.session.usuarioConectado);
    },

    // usuario por ID (byPK)

    detalleUsuario: (req,res)=>{
        db.Usuario.findByPk(req.params.id)
            .then(usuario =>{
                res.render(path.join(__dirname,'../views/users/detalleUsuario.ejs'),{usuario:usuario})
            });

            


    },
    
    
    
    // controler de pagina de editar usuario
    
    editar:(req,res)=>{
        
        db.Usuario.findByPk(req.params.id)
        .then(usuario =>{
            res.render(path.join(__dirname, '../views/users/usuarioEdit.ejs'),{usuario:usuario})
        });
        console.log(req.session.usuarioConectado)
        
    },
    
    // usuario editado!
    
    editado:(req,res)=>{
        
        db.Usuario.update({
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            contraseña: bcryptjs.hashSync(req.body.password),
            imagenusuario: req.file ? req.file.filename : productImage
            ,
            pais: req.body.pais,
            ciudad: req.body.ciudad,
            calle: req.body.calle,
            numero: req.body.numero
        },
        {
            where:{
                id: req.params.id
            }
        });
        
        res.redirect('/usuario/'+ req.params.id);
        
    },
    
    
    eliminar:(req,res)=>{
        
        db.Usuario.destroy({
            where:{
                id:req.params.id
            }
        });
        
        res.redirect('/usuarios')
    },

    login: (req,res) => {

        res.render(path.join(__dirname, '../views/users/login.ejs'));
    },

    logueado: async (req,res)=>{
        
      let usuario = await db.Usuario.findOne({
            where:{email: req.body.email }})

        if (usuario){

            let igualar = await bcryptjs.compareSync(req.body.password, usuario.contraseña )

            if(igualar){

            let usuarioLogueado = usuario         
            req.session.usuarioConectado = usuarioLogueado;
               //return res.render(path.join(__dirname, '../views/users/perfil.ejs'),{ usuario })
            return res.render(path.join(__dirname, '../views/users/perfil.ejs'),{ usuario })

                }else{
                    return res.render(path.join(__dirname, '../views/users/login.ejs'),{
                        errors:{
                            password:{ msg:'la contraseña es incorrecta'}
                        }                         
                    });
                } 

        }else{
             return res.render(path.join(__dirname, '../views/users/login.ejs'),{
                errors:{
                    email:{
                        msg:'El Email es invalido'

                    }
                }
                 
            });
        }
  
       
},
    perfil: (req,res)=>{

        console.log(req.session.usuarioConectado);


       return res.render(path.join-(__dirname,'../views/users/perfil.ejs'),{usuario})

}
}


module.exports = usuarioController;
     












