import {useEffect, useState} from 'react';
import firebase from 'firebase';
import {auth, storage, db} from './firebase.js';

function Header(props){

    const [user, setUser] = useState();  
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    useEffect(()=>{
        // props.setUser = "João";
    },[]);

    //Abrindo modal p/ criação de conta

    function abrirModalCriarConta(e){
      e.preventDefault();
      let modalCriarConta = document.querySelector('.modalCriarConta');
      modalCriarConta.style.display = 'block';
    }

    //Fechando modal p/ criação de conta

    function fecharCriarConta(){
      let modalCriarConta = document.querySelector('.modalCriarConta');
      modalCriarConta.style.display = 'none';
    }

    //Criação de Conta

    function criarConta(e){
      e.preventDefault();
      let email = document.getElementById('email-cadastro').value;
      let username = document.getElementById('username-cadastro').value;
      let password = document.getElementById('password-cadastro').value;

      //Criar conta Firebase
      auth.createUserWithEmailAndPassword(email,password).then((authUser)=>{
        authUser.user.updateProfile({
          displayName: username
        })
        alert('Conta Criada com sucesso!');
        let modalCriarConta = document.querySelector('.modalCriarConta');
        modalCriarConta.style.display = 'none';
      }).catch((error)=>{
        alert(error.message);
      });
    }

    //Login no App

    function loginApp(e){
      e.preventDefault();
      let email = document.getElementById('email-login').value;
      let password = document.getElementById('password-login').value;

      auth.signInWithEmailAndPassword(email,password).then((auth)=>{
        props.setUser(auth.user.displayName);
        alert('Login efetuado com sucesso!');
        window.location.reload();
      }).catch((err)=>{
        alert(err.message);
      });
    }

    //Logout no App
    
    function logoutApp(e){
      e.preventDefault();
      auth.signOut().then(function(val){
        props.setUser(null);
        window.location.reload();
      })
    }

    // Abrir Upload de Postagem

    function abrirUploadPost(e){
      e.preventDefault();
      let uploadPost = document.querySelector('.modalUploadPost')
      uploadPost.style.display = 'block';
    }

    //Fechar Upload de Postagem

    function fecharUploadPost(){
      let uploadPost = document.querySelector('.modalUploadPost');
      uploadPost.style.display = 'none';
    }

    //Upload de Postagem

    function uploadPost(e){
      e.preventDefault();
      let tituloPost = document.getElementById('titulo-postagem').value;
      let progressBar = document.getElementById('progressBar');

      const uploadTask = storage.ref(`images/${file.name}`).put(file);

      uploadTask.on("state_changed", function(snapshot){
        const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        setProgress(progress);
      },function(error){

      },function(){
        storage.ref("images").child(file.name).getDownloadURL().then(function(url){
            db.collection('posts').add({
              titulo: tituloPost,
              image: url,
              userName: props.user,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            setProgress(0);
            setFile(null);

            alert("Upload Concluído!");

            document.getElementById('formUpload').reset();
            fecharUploadPost();
        })
      })
    }

    return(

      <header className="header">

        <section className="modalCriarConta">
          <div className="formCriarConta">
            <div onClick={()=>fecharCriarConta()} className="fecharCriarConta">X</div>
            <h2>Crie já a sua conta!</h2>
            <form onSubmit={(e)=>criarConta(e)}>
              <input type='text' id="username-cadastro" placeholder='Insira seu nome de usuário..' />
              <input type='email' id="email-cadastro" placeholder='Insira seu e-mail..' />
              <input type="password" id="password-cadastro" placeholder="Insira sua senha.." />
              <input type="submit" name="acao" value="Criar conta!" />
            </form>
          </div>
        </section>

        <section className="modalUploadPost">
          <div className="formUploadPost">
            <div onClick={()=>fecharUploadPost()} className="fecharUploadPost">X</div>
            <h2>Criar postagem</h2>
            <form onSubmit={(e)=>uploadPost(e)} id ="formUpload">
              <div className="containerProgress">
                <progress id="progressBar" value={progress}></progress>
              </div>
              <input type='text' id="titulo-postagem" placeholder='Insira a legenda...' />
              <input onChange={(e)=>setFile(e.target.files[0])} type="file" id="arquivo-postagem" name="file" />
              <input type="submit" name="acao" value="Criar postagem!" />
            </form>
          </div>
        </section>

        <div className="center">
          <div className = "header__logo">
            <a href="#"><img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" /></a>
          </div> {/* Logo */}

          {
            (props.user)?
            <div className = "header__userLogado">
              <span>Olá, <strong>{props.user}</strong></span>
              <a onClick={(e)=>abrirUploadPost(e)} href="#" className="openUploadPost">Postar</a>
              <button onClick={(e)=>logoutApp(e)}>Sair</button>
            </div>
            :
            <div className="header__loginForm">
            <form onSubmit={(e)=>loginApp(e)}>
              <input type="email" id="email-login" placeholder="Insira seu e-mail.." />
              <input type="password" id="password-login" placeholder="Insira a senha.." />
              <input type="submit" name="acao" value="Entrar!" />
            </form>
            <div className="header__loginForm__criarConta">
              <a onClick={(e)=>abrirModalCriarConta(e)} href="#">Criar uma conta</a>
            </div>
          </div>
          }
        </div> {/* Centralização */}
      </header>
    );
}

export default Header;