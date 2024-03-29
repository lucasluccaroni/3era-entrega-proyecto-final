import { useEffect, useState } from "react"
import ItemDetail from "../ItemDetail/ItemDetail"
import { useParams } from "react-router-dom"
import estilos from "./ItemDetailContainer.module.css"
import { useNotification } from "../../notification/NotificationService"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../../services/firebase/firebaseConfig"
import { createProductAdaptedFromFirestore } from "../../adapters/createProductAdaptedFromFirestore"


const ItemDetailContainer = () =>{
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const {productId} = useParams()
    const {showNotification} = useNotification()

    useEffect(()=>{
        document.title = "Retro-Store: Detalle"
    },[])


    useEffect(() =>{
        setLoading(true)

        const documentRef = doc(db, "products", productId)
        getDoc(documentRef)
            .then(queryDocumentSnapshot => {
                const productAdapted = createProductAdaptedFromFirestore(queryDocumentSnapshot)
                setProduct(productAdapted)
            })
            .catch(error => {
                console.log(error);
                showNotification("error", "Hubo un error cargando el producto, intente nuevamente.")
            })
            .finally(() =>{
                setLoading(false)
            })
    },[productId])


    if(loading){
        return <h1 className={estilos.loading} >Cargando...</h1>
    }

    return(
        <div className={estilos.cardContainer} >
            <ItemDetail {...product} />
        </div>
    )
}

export default ItemDetailContainer