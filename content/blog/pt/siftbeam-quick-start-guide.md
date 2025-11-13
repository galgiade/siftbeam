---
slug: siftbeam-quick-start-guide
title: "Como usar o siftbeam: Guia completo do fluxo de serviço"
description: "Aprenda o fluxo completo do processamento de dados com siftbeam, explicado de forma fácil de entender para iniciantes. Guia passo a passo desde a criação de conta até a configuração de políticas, criação de grupos, processamento de arquivos e download de resultados."
author: Equipe editorial do siftbeam
publishedAt: 2025-01-16
category: tutorial
tags:
  - Tutorial
  - Modo de uso
  - Guia para iniciantes
  - Guia completo
  - Processamento de dados
readingTime: 15 min
---

# Como usar o siftbeam: Guia completo do fluxo de serviço

## Índice

1. [O que você aprenderá](#o-que-você-aprenderá)
2. [Visão geral do fluxo de serviço](#visão-geral-do-fluxo-de-serviço)
3. [Pré-requisitos](#pré-requisitos)
4. [Passo 1: Criação de conta e registro da empresa](#passo-1-criação-de-conta-e-registro-da-empresa)
5. [Passo 2: Solicitar política através de novo pedido](#passo-2-solicitar-política-através-de-novo-pedido)
6. [Passo 3: Criar grupos](#passo-3-criar-grupos)
7. [Passo 4: Processar arquivos na página de serviço](#passo-4-processar-arquivos-na-página-de-serviço)
8. [Passo 5: Revisar e baixar resultados](#passo-5-revisar-e-baixar-resultados)
9. [Próximos passos](#próximos-passos)

## O que você aprenderá

Ao ler este artigo, você será capaz de:

- ✅ Compreender o fluxo completo do serviço siftbeam
- ✅ Criar uma conta e registrar informações da empresa
- ✅ Solicitar uma política (configuração de processamento) através de um novo pedido
- ✅ Criar grupos e vincular usuários com políticas
- ✅ Fazer upload de arquivos e executar o processamento na página de serviço
- ✅ Revisar e baixar resultados do processamento

**Tempo necessário**: A configuração inicial leva vários dias a 1 semana (incluindo consulta de política), o processamento posterior leva minutos

**Dificuldade**: ★★☆☆☆ (Adequado para iniciantes)

## Visão geral do fluxo de serviço

siftbeam é um serviço B2B que fornece processamento de dados personalizado para cada empresa. O fluxo para começar a usar o serviço é o seguinte:

```
1. Criação de conta e registro da empresa
   ↓
2. Solicitar política (configuração de processamento) através de novo pedido
   ↓
3. Política concluída (configurada por nossa equipe)
   ↓
4. Criar grupos (vincular usuários com políticas)
   ↓
5. Fazer upload de arquivos e processar na página de serviço
   ↓
6. Baixar resultados do processamento
```

**Pontos-chave**:
- A característica principal do siftbeam é a "personalização por cliente"
- A configuração inicial requer consulta de política (configuração de processamento)
- Uma vez configurada a política, você pode processar dados repetidamente

## Pré-requisitos

Antes de começar, prepare o seguinte:

### Itens necessários

- **Endereço de e-mail**: Usado para registro de conta
- **Informações da empresa**: Nome da empresa, endereço e outras informações básicas
- **Arquivos de dados para processar**: CSV, JSON, Excel, etc. (como arquivos de amostra)

### Ambiente recomendado

- **Navegador**: Chrome, Firefox, Safari, Edge (versão mais recente)
- **Conexão à Internet**: Ambiente de conexão estável

## Passo 1: Criação de conta e registro da empresa

### 1-1. Inscrição

Visite a [página de inscrição do siftbeam](https://siftbeam.com/pt/signup/auth).

**Informações necessárias**:
- **Endereço de e-mail**: Endereço de e-mail empresarial
- **Senha**: 8 caracteres ou mais, incluindo letras, números e símbolos

Após a verificação por e-mail, você será redirecionado para a tela de login.

### 1-2. Registrar informações da empresa

O registro de informações da empresa é necessário no primeiro login.

**Campos obrigatórios**:
- Nome da empresa
- País
- Código postal
- Estado/Província
- Cidade
- Endereço linha 1
- Número de telefone
- E-mail de faturamento

**Campos opcionais**:
- Endereço linha 2 (Nome do prédio, número do apartamento, etc.)

### 1-3. Criar conta de administrador

Após registrar as informações da empresa, crie uma conta de administrador.

- Nome
- Endereço de e-mail
- Senha

A criação da conta está agora concluída. Você pode acessar o painel de controle.

## Passo 2: Solicitar política através de novo pedido

Uma política define "que tipo de processamento de dados realizar". Como o siftbeam fornece processamento personalizado para cada cliente, você deve primeiro solicitar uma consulta de política.

### 2-1. Navegar para a página Novo pedido

1. Clique em "Novo pedido" no painel de controle
2. Clique no botão "Criar"

### 2-2. Solicitar configuração de processamento

Preencha as seguintes informações no formulário de novo pedido:

**Campos obrigatórios**:
- **Tipo de dados**: Selecione entre Dados estruturados, Dados não estruturados, Misto ou Outro
- **Tipo de modelo**: Selecione entre Classificação, Regressão, Agrupamento ou Outro
- **Assunto**: Breve descrição das necessidades de processamento
- **Detalhes**: Descrição específica do processamento de dados necessário

**Exemplo**:
```
Tipo de dados: Dados estruturados
Tipo de modelo: Classificação
Assunto: Transformação de dados de arquivo CSV

Detalhes:
- Entrada: CSV de dados de clientes (nome, endereço, número de telefone, etc.)
- Processamento: Normalização de endereços, padronização de formato de números de telefone
- Saída: Arquivo CSV formatado
- Frequência: Aproximadamente uma vez por semana
- Volume de dados: Aproximadamente 10.000 registros por lote
```

### 2-3. Anexar arquivos de amostra (Opcional)

Anexar arquivos de amostra dos dados que você deseja processar permite estimativas mais precisas.

- Máximo 10 arquivos
- Até 50 MB por arquivo

### 2-4. Enviar e revisar

Após enviar o formulário, nossa equipe revisará o conteúdo e:

1. **Confirmar requisitos de processamento**: Escuta de necessidades
2. **Fornecer estimativa**: Custos aproximados de processamento
3. **Criar política**: Configurar fluxo de processamento
4. **Execução de teste**: Verificar operação com dados de amostra

**Tempo necessário**: Geralmente 2-5 dias úteis

### 2-5. Política concluída

Uma vez que nossa equipe cria e conclui a configuração da política, o status do novo pedido será atualizado. Você pode verificar o progresso na página "Novo pedido" do painel de controle.

Uma vez concluída a política, você pode prosseguir para o próximo passo.

## Passo 3: Criar grupos

Uma vez concluída a política, crie grupos. Os grupos são um mecanismo para gerenciar "quais usuários podem usar quais políticas".

### 3-1. Navegar para a página Gerenciamento de grupos

1. Clique em "Gerenciamento de grupos" no painel de controle
2. Clique no botão "Criar"

### 3-2. Inserir informações do grupo

**Campos obrigatórios**:
- **Nome do grupo**: Defina um nome fácil de entender (por exemplo, Departamento de vendas, Equipe de análise de dados)
- **Descrição**: Propósito ou uso do grupo (opcional)

### 3-3. Selecionar políticas

Selecione as políticas que este grupo usará das políticas criadas.

- Múltiplas políticas podem ser selecionadas
- Podem ser adicionadas ou removidas posteriormente

### 3-4. Adicionar usuários

Adicione usuários que pertencerão ao grupo.

**Método 1: Adicionar usuários existentes**
- Selecione usuários já criados no Gerenciamento de usuários

**Método 2: Criar e adicionar novos usuários**
- Insira nome e endereço de e-mail
- Um e-mail de convite será enviado

### 3-5. Criação de grupo concluída

Uma vez que você crie o grupo, os usuários membros podem processar dados usando as políticas selecionadas.

## Passo 4: Processar arquivos na página de serviço

Uma vez concluída a configuração do grupo, você pode executar o processamento de dados.

### 4-1. Acessar a página de serviço

1. Clique em "Serviço" no painel de controle
2. Selecione a política a usar

### 4-2. Fazer upload de arquivos

**Método 1: Arrastar e soltar**
- Arraste e solte arquivos na área de upload

**Método 2: Seleção de arquivos**
- Clique em "Selecionar arquivos" e escolha do navegador de arquivos

**Limites**:
- Máximo 10 arquivos
- Recomendado 100 MB ou menos por arquivo
- Formatos suportados: Formatos configurados na política

### 4-3. Iniciar processamento

1. Uma vez que os arquivos sejam carregados, clique no botão "Iniciar processamento"
2. O processamento começa automaticamente

### 4-4. Monitorar status do processamento

Você pode verificar o status do processamento:

- **Status**: "Em processamento", "Concluído", "Erro"
- **Tempo de processamento**: Tempo decorrido desde o início do processamento
- **Informações do arquivo**: Nome do arquivo, tamanho

**Tempo estimado**:
- Varia de acordo com o volume de dados e o conteúdo do processamento
- Geralmente alguns segundos a minutos

### 4-5. Processamento em segundo plano

Durante o processamento, você pode:

- ✅ Fazer upload de outros arquivos
- ✅ Verificar histórico de processamento passado
- ✅ Fechar a tela (o processamento continua)

## Passo 5: Revisar e baixar resultados

Uma vez concluído o processamento, revise e baixe os resultados.

### 5-1. Verificar histórico de processamento

Você pode verificar o histórico de processamento na página de serviço ou no painel de controle.

**Informações exibidas**:
- **Status**: Processamento concluído, Em processamento, Erro
- **Data/Hora de processamento**: Data e hora de execução do processamento
- **Nome do arquivo**: Nome do arquivo processado
- **Tempo de processamento**: Tempo levado para o processamento
- **Volume de dados**: Tamanho dos dados processados

### 5-2. Baixar resultados

Você pode baixar arquivos concluídos com os seguintes passos:

1. Selecione o arquivo alvo do histórico de processamento
2. Clique no botão "Baixar"
3. O arquivo é baixado automaticamente

**Arquivos baixáveis**:
- **Arquivo de entrada**: Arquivo original carregado
- **Arquivo de saída**: Arquivo após o processamento

### 5-3. Período de retenção de dados

- **Período de retenção**: 1 ano a partir do upload
- **Exclusão automática**: Excluído automaticamente após 1 ano
- **Re-download**: Pode ser baixado várias vezes durante o período de retenção

**Importante**: 
Sempre faça backup dos dados necessários localmente.

### 5-4. Em caso de erros de processamento

Se ocorrer um erro, verifique o seguinte:

1. **Verificar mensagem de erro**: Identificar a causa
2. **Verificar formato do arquivo**: É o formato especificado na política?
3. **Verificar tamanho do arquivo**: Está dentro dos limites?
4. **Contatar suporte**: Se não resolvido, entre em contato com o suporte por chat

## Perguntas frequentes

Para informações mais detalhadas e respostas a perguntas comuns, visite nossa [página de perguntas frequentes](https://siftbeam.com/pt/faq).

Os tópicos cobertos incluem:
- Segurança e proteção de dados
- Preços e faturamento
- Formatos de arquivo suportados
- Sistema de suporte
- Recursos adicionais

E muito mais.

## Próximos passos

### Para uso mais avançado

Uma vez que você compreenda os conceitos básicos do siftbeam, prossiga para os próximos passos:

#### 1. Gerenciamento de usuários

- Adicionar membros da equipe
- Controlar acesso com configurações de permissão
- Criar grupos por departamento

#### 2. Integração de API

- Emitir chaves de API
- Criar scripts de automação
- Integrar com sistemas existentes

#### 3. Configurar processamento programado

- Configurar processamento programado
- Configurar uploads automáticos
- Criar relatórios periódicos

#### 4. Configuração avançada

- Consultar sobre fluxos de processamento personalizados
- Otimizar para grandes volumes de dados
- Reforçar configuração de segurança

### Se encontrar problemas

Se surgirem problemas, use os seguintes recursos:

- **FAQ**: Consulte soluções na [página de perguntas frequentes](https://siftbeam.com/pt/faq)
- **Consulta de suporte**: Envie consultas do Suporte em seu painel de controle
- **Tempo de resposta**: Normalmente responde em 3 dias úteis

## Resumo

Este artigo explicou o fluxo completo do processamento de dados com siftbeam:

1. ✅ **Criação de conta e registro da empresa**: Registro com e-mail e senha, inserção de informações da empresa
2. ✅ **Solicitar política através de novo pedido**: Consultar nossa equipe sobre o processamento de dados necessário
3. ✅ **Criar grupos**: Vincular usuários com políticas para preparar o uso
4. ✅ **Processar arquivos na página de serviço**: Fazer upload de arquivos, executar processamento, monitorar status
5. ✅ **Revisar e baixar resultados**: Verificar histórico, baixar arquivos de resultados

siftbeam é um serviço de processamento de dados personalizável para empresas. Otimize o processamento de dados de sua empresa com fluxos de trabalho adaptados a cada cliente.

### Comece agora

Quando estiver pronto, comece com siftbeam hoje.

[Começar com siftbeam](https://siftbeam.com/pt/signup/auth)

---

**Este artigo foi útil?** Aguardamos seus comentários.

