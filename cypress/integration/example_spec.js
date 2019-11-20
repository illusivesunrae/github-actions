const DEV_SERVER = "http://localhost:3000";
const EXAMPLE_BUTTON = '#my-button';

describe('Example code interaction', function() {
  it('Visits the sample page', function() {
    cy.visit(DEV_SERVER);
  });

  it('Should see the button', function() {
    cy.get(EXAMPLE_BUTTON)
      .should('be.visible');
  });

  it('Listen for alert', function() {
    const stub = cy.stub();

    cy.on('window:alert', stub)

    cy.get(EXAMPLE_BUTTON).click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Button clicked!')
      });

  });

});
