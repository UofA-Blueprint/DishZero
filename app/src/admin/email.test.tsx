// import { renderHook, act, waitFor } from "@testing-library/react";
// import { useAuth } from "./AuthContext";
// import fetchMock from "fetch-mock";

import { waitFor} from "@testing-library/react";
import fetchMock from "fetch-mock";

const apiAddress = process.env.REACT_APP_BACKEND_ADDRESS;
// const user = {
//   id: "1234",
//   role: "basic",
//   email: "abc@xyz.com",
// };
// const sessionToken = "test-test";

describe("Admin Email Page", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });

  describe("initial render", () => {
    it("should initially have the template from the backend", () => {
      // do testing for it, clicking buttons

      // render(<Router/>)
      // a mock response from the backend
      fetchMock.sandbox().get(`${apiAddress}/api/cron/email/`, {
        status: 200,
        body: {
          cron: {
            body: "A mock email body for testing",
            subject: "A mock email subject for testing",
            cronExpression: "0 0 12 * * WED",
            enabled: true,
          },
        },
      });

      waitFor(() => {
        expect(fetchMock.called()).toBe(true);
      });
      // const subjectInput = screen.getByLabelText("Subject");
      // expect(subjectInput.innerText).toBe("A mock email subject for testing");
    });
  });
});
