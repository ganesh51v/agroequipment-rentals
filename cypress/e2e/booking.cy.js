describe('Booking Flow', () => {
  beforeEach(() => {
    cy.visit('/services.html');
  });

  it('should navigate to booking page with selected equipment details', () => {
    // Click "Rent Now" for Tractor
    cy.contains('div.card.service-card', 'Tractor')
      .find('a.rent-btn')
      .click();

    // Verify URL includes equipment=Tractor
    cy.url().should('include', 'booking-fixed.html?equipment=Tractor');

    // Verify equipment details are populated
    // Wait for equipment name to be updated from default
    cy.get('#equipment-name', { timeout: 10000 }).should('not.contain.text', 'the selected equipment');
    cy.get('#equipment-name').should('contain.text', 'Tractor');
    cy.get('#equipment-description').should('not.be.empty');
    cy.get('#equipment-img').should('have.attr', 'src').and('include', 'uploads');
  });

  it('should show alert and fallback if equipment not found', () => {
    // Visit booking page with invalid equipment query param
    cy.visit('/booking-fixed.html?equipment=InvalidEquipment');

    // Should show alert about equipment not found
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Selected equipment "InvalidEquipment" not found');
    });

    // Should fallback to first equipment details
    cy.get('#equipment-name').should('not.contain.text', 'InvalidEquipment');
  });

  it('should allow booking form submission when logged in', () => {
    // Mock login by setting token in localStorage
    cy.visit('/booking-fixed.html?equipment=Tractor').then(() => {
      window.localStorage.setItem('token', 'fake-jwt-token');
    });

    // Fill booking form
    cy.get('#booking-name').type('Test User');
    cy.get('#booking-phone').type('999-999-9999');
    cy.get('#booking-email').type('test@example.com');
    cy.get('#booking-address').type('123 Farm Lane');
    cy.get('#start-date').type('2025-01-01');
    cy.get('#end-date').type('2025-01-05');
    cy.get('#start-time').type('08:00');
    cy.get('#end-time').type('17:00');

    // Submit form
    cy.get('#booking-form').submit();

    // Verify success alert
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Your booking request has been received');
    });
  });
});
