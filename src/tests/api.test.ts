import { userLogin } from "../api/api";

const axios400ErrorObject = {
  response: {
    status: 400,
  },
  isAxiosError: true
}

const userObject = {
  username: "joshua",
  password: "123456"
}

describe("API", () => {
  it('denys login with 400 status', async () => {
    await expect(userLogin({})).rejects.toMatchObject(axios400ErrorObject)
  });

  it('logs in and sends token', async () => {
    const response = await userLogin(userObject);

    expect(response.data).toBeDefined();
  });

  it('successfully completes a login flow and adds token to subsequent requests', async () => {
    // Mock localStorage methods
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    const response = await userLogin(userObject);

    expect(response.status).toBe(200);
    expect(localStorageMock.setItem).toHaveBeenCalledWith("authToken", expect.anything());
  })
})