const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    store: user.store,
  };
};
const createTokenCustomers = (customers) => {
  return {
    lastName: customers.lastName,
    customersId: customers._id,
    firstName: customers.firstName,
    email: customers.email,
  };
};

module.exports = { createTokenUser, createTokenCustomers };