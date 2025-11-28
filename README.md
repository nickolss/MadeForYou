# MadeForYou 🚀

**MadeForYou** é uma plataforma completa de **Gestão Pessoal (ERP Pessoal)** projetada para organizar sua vida em um só lugar. O sistema integra gerenciamento de tarefas, projetos, hábitos, notas e finanças em uma interface moderna e intuitiva.


## 📋 Funcionalidades

O sistema é dividido em módulos integrados:

*   🔐 **Autenticação Segura:** Integração com **Firebase Auth** (Login/Cadastro) e sincronização automática de perfil.
*   ✅ **Minhas Tarefas:** Gestão de To-Do com prioridades, datas de vencimento e filtros (Pendentes/Concluídas).
*   🚀 **Meus Projetos:** Acompanhamento de projetos com barra de progresso visual, status e prazos.
*   📅 **Rastreador de Hábitos:** Visualize sua consistência (streaks) em um formato de calendário semanal.
*   📝 **Notas Inteligentes:** Crie anotações rápidas categorizadas por tags e cores.
*   💰 **Finanças:** Controle de saldo, gestão de contas bancárias e registro de transações (Entradas/Saídas).
*   ⚙️ **Configurações:** Modo Escuro/Claro, gestão de perfil e segurança.

---

## 🛠️ Tech Stack

### Backend (API)
*   **Linguagem:** Java 17+
*   **Framework:** Spring Boot 3
*   **Arquitetura:** REST API (Layered Architecture)
*   **Banco de Dados:** PostgreSQL (Produção) / H2 (Dev)
*   **ORM:** Spring Data JPA / Hibernate
*   **Documentação:** Swagger UI / OpenAPI
*   **Segurança:** Firebase Admin SDK


---


## 🚀 Como Executar Localmente

Siga os passos abaixo para rodar o projeto na sua máquina.

### 1. Pré-requisitos
Certifique-se de ter instalado:
*   [Java JDK 17+](https://adoptium.net/)
*   [Maven](https://maven.apache.org/) (ou use o wrapper `./mvnw`)
*   [Docker](https://www.docker.com/) (Opcional, para o Banco de Dados)
*   [Flutter SDK](https://docs.flutter.dev/get-started/install) (Para o App Mobile)
*   Uma conta no [Firebase Console](https://console.firebase.google.com/)

### 2. Configuração do Banco de Dados
PostgreSQL.
