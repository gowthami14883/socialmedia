import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PostActions from "./postActions";

describe("PostActions", () => {
  const createProps = (overrides = {}) => ({
    post: {
      id: 42,
      liked: false,
      commentCount: 3,
      isStatic: false,
      ...overrides,
    },
    handleLike: jest.fn(),
    activeCommentPost: null as string | number | null,
    setActiveCommentPost: jest.fn(),
    fetchCommentsForPost: jest.fn().mockResolvedValue(undefined),
  });

  it("calls handleLike with the current post state", () => {
    const props = createProps();
    const { container } = render(<PostActions {...props} />);

    const likeButton = container.querySelector(".like-btn");

    expect(likeButton).not.toBeNull();
    fireEvent.click(likeButton!);

    expect(props.handleLike).toHaveBeenCalledWith(42, false, false);
  });

  it("opens comments and fetches them for dynamic posts", async () => {
    const props = createProps();
    const { container } = render(<PostActions {...props} />);

    const commentButton = container.querySelector(".comment-wrapper");

    expect(commentButton).not.toBeNull();
    fireEvent.click(commentButton!);

    await waitFor(() => {
      expect(props.setActiveCommentPost).toHaveBeenCalledWith(42);
    });
    expect(props.fetchCommentsForPost).toHaveBeenCalledWith(42);
  });

  it("does not fetch comments for static posts", async () => {
    const props = createProps({ isStatic: true });
    const { container } = render(<PostActions {...props} />);

    const commentButton = container.querySelector(".comment-wrapper");

    expect(commentButton).not.toBeNull();
    fireEvent.click(commentButton!);

    await waitFor(() => {
      expect(props.setActiveCommentPost).toHaveBeenCalledWith(42);
    });
    expect(props.fetchCommentsForPost).not.toHaveBeenCalled();
  });

  it("renders the comment count when comments exist", () => {
    render(<PostActions {...createProps()} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
