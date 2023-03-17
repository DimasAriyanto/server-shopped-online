const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    company: user.company,
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