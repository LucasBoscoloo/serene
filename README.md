# Serene — Agendamento de massagens

## Objetivo
Aplicação demonstrativa para clientes solicitarem horários de massagem e para a profissional acompanhar solicitações, confirmar ou cancelar atendimentos e controlar a disponibilidade.

## Integrantes
- [Preencher com o nome do(a) integrante 1]
- [Preencher com o nome do(a) integrante 2]
- [Adicionar ou remover linhas conforme o grupo]

## Tecnologias
- HTML5
- CSS3 (layout responsivo)
- JavaScript (sem bibliotecas externas)
- `localStorage` do navegador para preservar os dados de demonstração neste dispositivo e navegador

## Requisitos
- Navegador moderno com JavaScript habilitado.
- Não é necessário instalar dependências, banco de dados ou servidor.
- Para visualizar os dados gravados, abra o projeto no mesmo navegador e perfil. Limpar os dados do navegador remove os registros locais.

## Instalação e execução
1. Extraia o arquivo ZIP em uma pasta.
2. Abra `index.html` em um navegador (Chrome, Edge, Firefox ou equivalente).
3. Na aba **Agendar massagem**, selecione uma data futura, um horário disponível e informe nome e telefone fictícios com DDD.
4. Acesse **Área da profissional** para consultar, confirmar, cancelar ou reabrir solicitações e bloquear/desbloquear horários livres.

## Funcionalidades
- Calendário com seleção de datas e horários futuros.
- Validação dos dados de contato.
- Registro de solicitações com estado pendente.
- Painel da profissional com consulta por data e contadores.
- Confirmação, cancelamento e reabertura de solicitações.
- Bloqueio e liberação de horários sem atendimento ativo.
- Persistência local entre recargas da página.
- Layout adaptável para telas menores.

## Demonstração
Abra `index.html` e siga os passos de execução. A agenda inicia com um atendimento fictício de exemplo para facilitar a avaliação. Esse registro pode ser cancelado no painel.

## Limitações
Este é um projeto acadêmico executado localmente. Os dados ficam apenas no navegador usado e não são compartilhados entre dispositivos. O painel não possui autenticação e não deve receber dados reais. O endereço, duração e valor do atendimento precisam ser combinados com a profissional. Para publicação real, seriam necessários servidor, banco de dados, autenticação e proteção dos dados pessoais.

## Repositório GitHub
- URL: [Inserir aqui o link do repositório após a publicação]
- Antes da entrega, confirme que o professor tem acesso ao repositório.

## Entrega do vídeo
Grave a demonstração das funcionalidades, tecnologias e resultados, garantindo que todos os integrantes apresentem sua participação com a câmera aberta, conforme as orientações do PIC I. O vídeo deve ser anexado no Teams ou compartilhado por link.

## Acesso demonstrativo da área profissional
- Usuário: `admin`
- Senha: `1234`

O login de demonstração libera o painel na sessão atual do navegador. Como o projeto é estático e não possui servidor, as credenciais ficam no código e não oferecem segurança para dados reais. A implantação real exige autenticação no servidor.



