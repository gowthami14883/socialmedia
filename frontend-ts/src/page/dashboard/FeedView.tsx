import { useRef, useEffect, useState, useCallback } from "react";
import Feed from "../../components/feed";
import VisualPanel from "./VisualPanel";

function FeedView() {

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const handleScroll = useCallback(() => {

    const el = scrollRef.current;

    if (!el) return;

    const scrollPosition = el.scrollTop + el.clientHeight;
    const threshold = el.scrollHeight - 50;

    if (scrollPosition >= threshold && page < totalPages && !loading) {
      console.log("Reached bottom, loading next page...");
      setPage((prev) => prev + 1);
    }

  }, [page, totalPages, loading]);

  useEffect(() => {

    const container = scrollRef.current;

    if (!container) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const throttledScroll = () => {

      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 200);

    };

    container.addEventListener("scroll", throttledScroll);

    return () => {
      container.removeEventListener("scroll", throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };

  }, [handleScroll]);

  return (
    <div className="feed-layout">

      <div className="scroll-view feed-center" ref={scrollRef}>
        <Feed
          page={page}
          setTotalPages={setTotalPages}
          loading={loading}
          setLoading={setLoading}
        />
      </div>

      <VisualPanel />

    </div>
  );
}

export default FeedView;