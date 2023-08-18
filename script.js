// JavaScript (script.js)
let inputNovaTarefa = document.querySelector('#NovaTarefa');
let addTarefa = document.querySelector('#AddTarefa');
let listaDeTarefa = document.querySelector('#listaTarefas');
let EdicaoDasTarefas = document.querySelector('#janelaEdicao');
let fundoEdicaoTarefas = document.querySelector('#janelaEdicaoFundo');
let fecharEdicaoTarefas = document.querySelector('#janelaEdicaoFechar');
let atualizarTarefa = document.querySelector('#AtualizarTarefa');
let IdTarefaEdicao = document.getElementById('idTarefaEdicao');
let EditarTarefa = document.querySelector('#mudarONomeDaTarefa');
let dbTarefas = [];
let theme = document.querySelector('#theme')
let conteudo = document.querySelector('.conteudo')
let topo = document.querySelector('.topo')
let btnAcao = document.querySelector('.btnAcao')
let frmLinha = document.querySelector('.frm-linha')



const qtdIdDisponiveis = Number.MAX_VALUE;
const KEY_CODE_CENTER = 13;
const KEY_LOCAL_STORAGE = 'listaDeTarefas';

obterTarefasLocalStorage();
renderizarListaTarefaHTML();

theme.addEventListener('click', (e) => {
    
    document.body.classList.toggle('light');
    conteudo.classList.toggle('light');
    topo.classList.toggle('light');
    frmLinha.classList.toggle('light');
    listaDeTarefa.classList.toggle('light');

})
inputNovaTarefa.addEventListener('keypress', (e) => {
    if (e.keyCode == KEY_CODE_CENTER) {
        let tarefa = {
            nome: inputNovaTarefa.value,
            id: gerarIdUnico()
        };
        adicionarTarefa(tarefa);
    }
});

fecharEdicaoTarefas.addEventListener('click', (e) => {
    alternarJanelaEdicao();
});

addTarefa.addEventListener('click', (e) => {
    let tarefa = {
        nome: inputNovaTarefa.value,
        id: gerarIdUnico()
    };
    adicionarTarefa(tarefa);
});

atualizarTarefa.addEventListener('click', (e) => {
    e.preventDefault();

    let idTarefa = IdTarefaEdicao.innerHTML.replace('#', '');

    let tarefa = {
        nome: EditarTarefa.value,
        id: idTarefa
    };

    let tarefaAtual = document.getElementById(idTarefa);

    if (tarefaAtual) {
        const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
        dbTarefas[indiceTarefa] = tarefa;
        salvarTarefasLocalStorage();

        let li = tagLi(tarefa);
        listaDeTarefa.replaceChild(li, tarefaAtual);
        alternarJanelaEdicao();
    } else {
        alert('Elemento HTML não encontrado!');
    }
});

function tagLi(tarefa) {
    let li = document.createElement('li');
    li.id = tarefa.id;

    let span = document.createElement('span');
    span.classList.add('textoTarefa');
    span.innerHTML = tarefa.nome;

    let div = document.createElement('div');

    let editar = document.createElement('button');
    editar.classList.add('btnAcao');
    editar.innerHTML = '<i class="fa fa-pencil"></i>';
    editar.setAttribute('onclick', 'editar(' + tarefa.id + ')');

    let excluir = document.createElement('button');
    excluir.classList.add('btnAcao');
    excluir.innerHTML = '<i class="fa fa-trash"></i>';
    excluir.setAttribute('onclick', 'excluir(' + tarefa.id + ')');

    
    div.appendChild(editar);
    div.appendChild(excluir);

    li.appendChild(span);
    li.appendChild(div);
    
    if (document.body.classList.contains('light'))
    {excluir.classList.toggle('light')
    editar.classList.toggle('light')}

    return li;
}

function editar(idTarefa) {
    let li = document.getElementById(idTarefa);
    if (li) {
        IdTarefaEdicao.innerHTML = '#' + idTarefa;
        EditarTarefa.value = li.querySelector('.textoTarefa').innerText;
        alternarJanelaEdicao();
    } else {
        alert('Elemento não encontrado!');
    }
}

function obterIndiceTarefaPorId(idTarefa) {
    return dbTarefas.findIndex((tarefa) => tarefa.id === idTarefa);
}

function excluir(idTarefa) {
    let confirmacao = window.confirm('Tem certeza?');
    if (confirmacao) {
        const indiceTarefa = obterIndiceTarefaPorId(idTarefa);
        dbTarefas.splice(indiceTarefa, 1);
        salvarTarefasLocalStorage();
        let li = document.getElementById(idTarefa);
        if (li) {
            listaDeTarefa.removeChild(li);
        } else {
            alert('Elemento não encontrado!');
        }
    }
}

function gerarId() {
    return Math.floor(Math.random() * qtdIdDisponiveis);
}

function gerarIdUnico() {
    let itensDaLista = document.querySelectorAll('#listaTarefas li');
    let idsGerados = [];

    for (let i = 0; i < itensDaLista.length; i++) {
        idsGerados.push(itensDaLista[i].id);
    }

    let contadorIds = 0;
    let id = gerarId();

    while (contadorIds <= qtdIdDisponiveis && idsGerados.indexOf(id.toString()) > -1) {
        id = gerarId();
        contadorIds++;

        if (contadorIds >= qtdIdDisponiveis) {
            alert('Acabaram-se os IDs');
            throw new Error('Acabaram-se os IDs');
        }
    }

    return id;
}

function alternarJanelaEdicao() {
    EdicaoDasTarefas.classList.toggle('abrir');
    fundoEdicaoTarefas.classList.toggle('abrir');

    if (document.body.classList.contains('light')) {
        EdicaoDasTarefas.classList.toggle('light');
        fundoEdicaoTarefas.classList.toggle('light');
    }
}

function obterTarefasLocalStorage() {
    if (localStorage.getItem(KEY_LOCAL_STORAGE)) {
        dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE));
    }
}

function salvarTarefasLocalStorage() {
    localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(dbTarefas));
}

function renderizarListaTarefaHTML() {
    listaDeTarefa.innerHTML = '';
    for (let i = 0; i < dbTarefas.length; i++) {
        let li = tagLi(dbTarefas[i]);
        listaDeTarefa.appendChild(li);
    }
    inputNovaTarefa.value = '';
}

function adicionarTarefa(tarefa) {
    dbTarefas.push(tarefa);
    salvarTarefasLocalStorage();
    renderizarListaTarefaHTML();
}

// Carregar tarefas do LocalStorage ao iniciar
function obterTarefasLocalStorage() {
    if (localStorage.getItem(KEY_LOCAL_STORAGE)) {
        dbTarefas = JSON.parse(localStorage.getItem(KEY_LOCAL_STORAGE));
    }
    renderizarListaTarefaHTML();
}
