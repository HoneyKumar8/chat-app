import {
  render,
  screen
} from "@testing-library/react";

import MessageBubble
  from "./MessageBubble";


describe(
  "MessageBubble",
  () => {

    test(
      "renders message",
      () => {

        render(
          <MessageBubble
            message={{
              content:
                "Hello"
            }}
            currentUser={{}}
            socket={{}}
          />
        );

        expect(
          screen.getByText(
            "Hello"
          )
        ).toBeInTheDocument();
      }
    );

  }
);