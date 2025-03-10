import { userLogin, userSignup } from "../api/api";

const axios400ErrorObject = {
  response: {
    status: 400,
  },
  isAxiosError: true
}

const axios401ErrorObject = {
  response: {
    status: 401,
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

  it('denys login with 401 status', async () => {
    await expect(userLogin({username: "joshua", password: "12345678"})).rejects.toMatchObject(axios401ErrorObject)
  });

  it('logs in and sends token', async () => {
    const response = await userLogin(userObject);

    console.log(response.data);
    
    expect(response.data).toBeDefined();
    expect(response.data.accessToken).toBeDefined();
    expect(response.data.refreshToken).toBeDefined();
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
    expect(localStorageMock.setItem).toHaveBeenCalledWith("accessToken", expect.anything());
    expect(localStorageMock.setItem).toHaveBeenCalledWith("refreshToken", expect.anything());
  })

  it('denys signup (missing creds)', async () => {
    await expect(userSignup({})).rejects.toMatchObject(axios400ErrorObject);
  })
})