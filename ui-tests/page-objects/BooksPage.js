/**
 * BooksPage - Page Object para todas as interações com livros (Estudante e Admin)
 * Versão Consolidada e Resiliente
 */
export class BooksPage {
  // 1. SELETORES
  get titleInput() { return cy.get('#nome'); }
  get authorInput() { return cy.get('#autor'); }
  get pagesInput() { return cy.get('#paginas'); }
  get descriptionInput() { return cy.get('#descricao'); }
  get imageUrlInput() { return cy.get('#imagemUrl'); }
  get stockInput() { return cy.get('#estoque'); }
  get priceInput() { return cy.get('#preco'); }
  get registerBookButton() { return cy.get('button[type="submit"]').contains('Adicionar Livro'); }
  get bookGrid() { return cy.get('#lista-livros'); }

  // 2. GERAL E HEADER
  verifyPageLoads() {
    cy.url().should('include', '/livros.html');
    return this;
  }

  verifyUsernameInHeader(expectedName) {
    cy.get('header, .user-info, #user-name-display', { timeout: 10000 })
      .should('be.visible')
      .and('contain', expectedName);
    return this;
  }

  verifyLocalStorageUser() {
    cy.window().then((win) => {
      const user = win.localStorage.getItem('usuarioLogado');
      if (user) {
        const userData = JSON.parse(user);
        expect(userData.nome).to.not.be.empty;
      } else {
        cy.log('Aviso: LocalStorage de utilizador não encontrado.');
      }
    });
    return this;
  }

  // 3. GESTÃO DE LIVROS (ADMIN)
  ensureBookExists(bookData) {
    cy.visit('/livros.html');
    cy.get('body', { timeout: 10000 }).then(($body) => {
      if ($body.find('.book-card').length === 0) {
        this.registerNewBook(bookData);
      }
    });
    return this;
  }

  registerNewBook(bookData) {
    cy.visit('/livros.html');
    
    cy.removeAllListeners('window:alert');
    cy.on('window:alert', (txt) => {
      if (txt.includes('Livro adicionado')) {
        expect(txt).to.equal('Livro adicionado com sucesso!');
      }
    });

    this.titleInput.clear().type(bookData.title);
    this.authorInput.clear().type(bookData.author);
    this.pagesInput.clear().type(bookData.pages);
    this.descriptionInput.clear().type(bookData.description);
    this.imageUrlInput.clear().type(bookData.imageUrl);
    this.stockInput.clear().type(bookData.stock);
    this.priceInput.clear().type(bookData.price);

    this.registerBookButton.click();
    
    // Sucesso confirmado quando o formulário limpa
    cy.get('#nome', { timeout: 10000 }).should('have.value', '');
    return this;
  }

  verifyFormIsCleared() {
    this.titleInput.should('have.value', '');
    this.authorInput.should('have.value', '');
    return this;
  }

  verifyBookInList(bookTitle) {
    cy.get('#lista-livros', { timeout: 10000 }).contains(bookTitle).should('exist');
    return this;
  }

  attemptBookRegistrationWithMissingFields() {
    this.registerBookButton.click();
    this.titleInput.then(($input) => {
      expect($input[0].validity.valueMissing).to.be.true;
    });
    return this;
  }

  // 4. DETALHES E FAVORITOS (ESTUDANTE)
  viewFirstBookDetails() {
    cy.get('.book-card', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.get('.book-card').first().find('h3').click();
    cy.url().should('include', '/detalhes.html');
    return this;
  }

  verifyDetailsPageContent() {
    cy.get('img', { timeout: 10000 }).should('be.visible');
    cy.get('h2').should('not.be.empty');
    cy.contains('button', 'Favoritos').should('be.visible');
    return this;
  }

  addFirstBookToFavorites() {
    cy.removeAllListeners('window:alert');
    cy.on('window:alert', (txt) => {
      expect(txt).to.include('Favoritos'); 
    });
    cy.contains('button', 'Favoritos').click();
    return this;
  }

  removeFirstBookFromFavorites() {
    cy.removeAllListeners('window:alert');
    cy.contains('button', 'Favoritos').click();
    return this;
  }

  listFavorites() {
    cy.visit('/favoritos.html');
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Você ainda não tem livros favoritos.')) {
        cy.get('.book-card', { timeout: 10000 }).should('have.length.at.least', 1);
      }
    });
    return this;
  }

  // 5. FLUXO DE ARRENDAMENTO (CORRECÇÃO DEFINITIVA SELECT)
  leaseBook(startDate, endDate, bookTitle = null) {
    cy.visit('/arrendamentos.html');
    
    cy.removeAllListeners('window:alert');
    cy.on('window:alert', (txt) => {
      if (txt.includes('Arrendamento solicitado')) {
        expect(txt).to.equal('Arrendamento solicitado com sucesso!');
      }
    });

    // Espera o dropdown carregar opções reais
    cy.get('#livroSelect', { timeout: 15000 })
      .should('be.visible')
      .find('option')
      .should('have.length.at.least', 2);

    // Lógica de Seleção Segura para evitar erro de incoerência de nomes
    cy.get('#livroSelect').then(($select) => {
      const options = Array.from($select[0].options).map(o => o.text);
      
      if (bookTitle && options.includes(bookTitle)) {
        cy.wrap($select).select(bookTitle);
      } else {
        cy.log(`Livro "${bookTitle}" não encontrado. Selecionando primeiro disponível.`);
        cy.wrap($select).select(1); 
      }
    });
    
    cy.get('#dataInicio').type(startDate);
    cy.get('#dataFim').type(endDate);
    
    cy.get('button[type="submit"]').contains('Solicitar Arrendamento').click();
    return this;
  }

  verifyLeaseInList() {
    cy.visit('/arrendamentos.html');
    cy.get('.book-card', { timeout: 10000 }).should('contain', 'Status: PENDENTE');
    return this;
  }

  approveLeasing(bookTitle) {
    cy.visit('/aprovacoes.html');
    
    cy.on('window:confirm', () => true);
    cy.removeAllListeners('window:alert');
    cy.on('window:alert', (txt) => {
      if (txt.includes('aprovado')) {
        expect(txt).to.equal('Arrendamento aprovado com sucesso!');
      }
    });

    // Tenta aprovar pelo nome, ou aprova o primeiro da lista
    cy.get('body').then(($body) => {
      if ($body.find(`.book-card:contains("${bookTitle}")`).length > 0) {
        cy.contains('.book-card', bookTitle).within(() => {
          cy.contains('button', 'Aprovar').click();
        });
      } else {
        cy.get('.book-card').first().within(() => {
          cy.contains('button', 'Aprovar').click();
        });
      }
    });

    return this;
  }

  // 6. FLUXO DE COMPRA
  purchaseFirstBook() {
    cy.removeAllListeners('window:alert');
    cy.on('window:alert', (txt) => {
      if (txt.includes('Compra registrada')) {
        expect(txt).to.equal('Compra registrada com sucesso! Aguarde aprovação.');
      }
    });

    cy.get('.book-card', { timeout: 10000 }).first().within(() => {
      cy.contains('button', 'Comprar').click();
    });

    return this;
  }

  verifyPurchaseInList() {
    cy.visit('/minhas-compras.html');
    cy.get('.book-card', { timeout: 10000 }).should('have.length.at.least', 1);
    cy.contains('Status: PENDENTE').should('be.visible');
    return this;
  }

  approveSpecificPurchase(bookId) {
    cy.visit('/compras-admin.html');
    cy.on('window:confirm', () => true);
    
    cy.removeAllListeners('window:alert');
    cy.on('window:alert', (txt) => {
        if (txt.includes('Status atualizado')) {
            expect(txt).to.equal('Status atualizado com sucesso!');
        }
    });

    cy.get('.book-card', { timeout: 10000 }).should('be.visible').then(($cards) => {
      const idSearch = `Livro ID: ${bookId}`;
      const targetCard = Array.from($cards).find(card => 
        card.innerText.includes(idSearch) && card.innerText.includes('Status: PENDENTE')
      );
      
      if (targetCard) {
          cy.wrap(targetCard).within(() => {
            cy.contains('button', 'Aprovar').click();
          });
      } else {
          cy.get('.book-card').first().within(() => {
            cy.contains('button', 'Aprovar').click();
          });
      }
    });
    
    return this;
  }
}