interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  lines = 1,
}: SkeletonProps) => {
  const baseClasses = 'skeleton';

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : variant === 'circular' ? width : '100%'),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton layouts
export const SkeletonCard = () => (
  <div className="glass-card p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="rectangular" height={100} />
    <div className="flex gap-2">
      <Skeleton variant="rectangular" width={80} height={32} />
      <Skeleton variant="rectangular" width={80} height={32} />
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="glass-card p-4 space-y-3">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" height={28} width="80%" />
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="glass-card p-6">
    <div className="flex justify-between items-center mb-6">
      <Skeleton variant="text" width={150} height={24} />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={60} height={32} />
        <Skeleton variant="rectangular" width={60} height={32} />
        <Skeleton variant="rectangular" width={60} height={32} />
      </div>
    </div>
    <Skeleton variant="rectangular" height={300} />
  </div>
);

export const SkeletonTable = () => (
  <div className="glass-card overflow-hidden">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <Skeleton variant="text" width={200} height={24} />
    </div>
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="20%" />
          </div>
          <Skeleton variant="rectangular" width={80} height={24} />
          <Skeleton variant="rectangular" width={100} height={32} />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
