
$( () => {

    $("#form-patrimonio").submit( (evt) => {
       evt.preventDefault()
       salvar(evt)
    })

    carregarPatrimonios()

})

const API = 'http://localhost:3000/api/'

/**
 * Carregar os patrimonios
 */
const carregarPatrimonios = () => {

    let tbody = document.getElementById('tb-body')

    fetch(`${API}patrimonios`)
    .then( r => r.json())
    .then( r => {
        
        tbody.innerHTML = ""

         r.forEach( p => {
            tbody.innerHTML += `
            <tr>
               <td>${p.id}</td>
               <td>${p.tipo}</td>
               <td>${p.modelo}</td>
               <td>${p.observacao}</td>
               <td>
                   <button class="btn btn-primary btn-sm" type="button" 
                           onclick="editar(this);"
                           data-id="${p.id}"
                           data-tipo="${p.tipo}"
                           data-modelo="${p.modelo}"
                           data-observacao="${p.observacao}">
                    <i class="fa fa-edit"></i> Editar
                    </button>

                    <button class="btn btn-danger btn-sm" type="button" 
                    onclick="excluir(this);"
                    data-id="${p.id}">
                    <i class="fa fa-trash"></i> Excluir
             </button>
               </td>
            </tr>`
         });
    })
}   

/**
 * Envia os dados para editar no formulário
 * @param {*} e
 */
const editar = (e) => {
   $("#id").val( $(e).attr('data-id'))
   $("#tipo").val( $(e).attr('data-tipo'))
   $("#modelo").val( $(e).attr('data-observacao'))
   $("#observacao").val( $(e).attr('data-observacao'))
}

/**
 * Salva os dados no banco de dados. (arquivo patrimonio.csv do servidor)
 */
const salvar = (obj) => {
    
        const pat = {
            "id": obj.target.id.value,
            "tipo": obj.target.tipo.value,
            "modelo": obj.target.modelo.value,
            "observacao": obj.target.observacao.value
        }

        fetch(`${API}patrimonio/${pat.id}/exists`)
        .then( r => r.json()).then(r => { 


        if ( r.Data ){
            fetch(`${API}patrimonio/update`,{
                method: 'PUT',
                headers: {'Content-type':'application/json, charset=UTF-8'},
                body: JSON.stringify(pat)
            })
            .then( r => r.json())
            .then( r => location.href = "/")
            .catch(err => console.log(err))
        } else {
            fetch(`${API}patrimonio/add`,{
                method: 'POST',
                headers: {'Content-type':'application/json, charset=UTF-8'},
                body: JSON.stringify(pat)
            })
            .then( r => r.json())
            .then( r => location.href = "/")
            .catch(err => console.log(err))
        }
    })

}

/**
 * Exclui um patrimonio do banco
 * @param {*} obj 
 */
const excluir = (obj) => {
    const pat = {
        "id": $(obj).attr('data-id')    
    }


     fetch(`${API}patrimonio/${pat.id}/delete`,{
         method: 'delete'
     })
     .then( r => r.json())
     .then(r => console.log(r))
     .then( r => location.href = "/")
     .catch(err => console.log(err))
}