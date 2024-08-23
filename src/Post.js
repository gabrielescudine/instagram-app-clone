import {useEffect, useState} from 'react';
import firebase from 'firebase';
import {auth, storage, db} from './firebase.js';

function Post(props){

    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
      
      db.collection('posts').doc(props.id).collection('comentarios').orderBy('timestamp', 'desc').onSnapshot(function(snapshot){
        setComentarios(snapshot.docs.map(function(document){
          return {
            id: document.id,
            info: document.data()
          }
        }))
      })

    },[]);

    function comentarPost(id, e){
        e.preventDefault();

        let comentarioAtual = document.getElementById('comentario__'+id).value;

        db.collection('posts').doc(id).collection('comentarios').add({
          nome: props.user,
          comentario: comentarioAtual,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        alert("Comentário feito com sucesso!");

        document.getElementById('comentario__'+id).value ="";
    }

    return(
        <div className="post-single">
          <img src={props.info.image} />
          <p><strong>{props.info.userName}</strong> : {props.info.titulo}</p>

          <section className="comments">
            {
              comentarios.map(function(val){
                return(
                  <div className="comment-single">
                    <p><strong>{val.info.nome}</strong> {val.info.comentario}</p>
                  </div>
                )
              })
            }
          </section>

          {
            (props.user)?
              <form onSubmit={(e)=>comentarPost(props.id,e)}>
                <textarea id={"comentario__"+props.id} placeholder="Mensagem..."></textarea>
                <input type="submit" value="Enviar" />
              </form>
            :
            <div></div>
          } 
        </div>
    )
}

export default Post;