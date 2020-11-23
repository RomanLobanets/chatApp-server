import axios from "axios";
// const axios = require("axios");

describe("user resolver", () => {
  test("allUsers", async () => {
    const responce = await axios.post("http://localhost:8080/", {
      query: `
            query{
                allUsers{
                    id

                    username
                    email
                }

            }`,
    });

    const { data } = responce;
    expect(data).toMatchObject({
      data: {
        allUsers: [
          {
            id: 1,
            username: "LobanetsRoman",
            email: "lobanets@gmail.com",
          },
          {
            id: 2,
            username: "kristina",
            email: "kristina@gmail.com",
          },
          {
            id: 3,
            username: "bratic",
            email: "bratic100760@gmail.com",
          },
          {
            id: 4,
            username: "Roman2302",
            email: "Roman2302@gmail.com",
          },
          {
            id: 5,
            username: "LobanetsRoman12",
            email: "lobanets1@gmail.com",
          },
          {
            id: 6,
            username: "2222",
            email: "2222@gmail.com",
          },
          {
            id: 7,
            username: "1111",
            email: "1111@gmail.com",
          },
          {
            id: 8,
            username: "3333",
            email: "3333@gmail.com",
          },
          {
            id: 9,
            username: "4444",
            email: "4444@gmail.com",
          },
          {
            id: 10,
            username: "5555",
            email: "5555@gmail.com",
          },
          {
            id: 11,
            username: "6666",
            email: "6666@gmail.com",
          },
          {
            id: 12,
            username: "7777",
            email: "7777@gmail.com",
          },
          {
            id: 13,
            username: "8888",
            email: "8888@gmail.com",
          },
          {
            id: 14,
            username: "9999",
            email: "9999@gmail.com",
          },
          {
            id: 15,
            username: "1010",
            email: "1010@gmail.com",
          },
          {
            id: 16,
            username: "1234",
            email: "1234@gmail.com",
          },
        ],
      },
    });
  });
  test("create user", async () => {
    const responce = await axios.post("http://localhost:8080/", {
      query: `
               mutation{
                   register(username:"testuser",email:"test@gmail.com",password:"123456"){
                       ok
                       errors{
                           path
                           message
                       }
                       user{
                           username
                           email
                       }
                   }
               }`,
    });

    const { data } = responce;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: "testuser",
            email: "test@gmail.com",
          },
        },
      },
    });
  });
});
