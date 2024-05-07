import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

jest.mock("react-d3-tree", () => ({
  Tree: () => "Tree",
}));

describe("XML Viewer App", () => {
  test("displays an error when an invalid XML file is uploaded", async () => {
    const { container } = render(<App />);
    const file = new File(["<root><tag></root>"], "invalid.xml", {
      type: "text/xml",
    });
    const input = container.querySelector('input[type="file"]');
    if (!input) throw new Error("File input not found"); // Ensures the input is not null
    userEvent.upload(input, file);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(/Error parsing XML: Invalid XML format./i)
      ).toBeInTheDocument();
    });

    // Simulate clicking on "Show Details"
    userEvent.click(screen.getByText(/Show Details/i));

    // Use findByText to wait for the details text to appear
    const detailsText = await screen.findByText(/Details:/i);
    expect(detailsText).toBeInTheDocument();
  });

  // To set a longer timeout for the specific test
  test("displays a success notification when a valid XML file is uploaded", async () => {
    jest.setTimeout(10000); // 10 seconds timeout for this test
    const { container } = render(<App />);
    const file = new File(["<root><tag></tag></root>"], "valid.xml", {
      type: "text/xml",
    });
    const input = container.querySelector('input[type="file"]');
    if (!input) throw new Error("File input not found"); // Ensures the input is not null
    userEvent.upload(input, file);

    await waitFor(
      () => {
        expect(
          screen.getByText(/File uploaded successfully!/i)
        ).toBeInTheDocument();
      },
      { timeout: 10000 }
    ); // Wait for up to 10 seconds

    // Optionally, ensure the notification disappears after a while
    await waitFor(
      () => {
        expect(
          screen.queryByText(/File uploaded successfully!/i)
        ).not.toBeInTheDocument();
      },
      { timeout: 15000 }
    );
  }, 20000); // Set the overall test timeout to 20 seconds
});
