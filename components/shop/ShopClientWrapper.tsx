"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition, useRef, useCallback, memo } from "react";
import ShopLoading from "@/app/shop/section/loading";

function ShopClientWrapperComponent({ children }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const paramsRef = useRef(searchParams.toString());
  
  const refreshData = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router, startTransition]);
  
  useEffect(() => {
    const currentParams = searchParams.toString();
    
    if (currentParams !== paramsRef.current) {
      paramsRef.current = currentParams;
      
      refreshData();
    }
  }, [searchParams, refreshData]);
  
  if (isPending) {
    return <ShopLoading />;
  }
    
  return <>{children}</>;
}

export default memo(ShopClientWrapperComponent); 