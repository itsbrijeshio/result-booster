import * as React from 'react';

// Card components conforming to shadcn specs with design tokens only
export function Card({ className = '', ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card text-card-foreground shadow-sm max-w-full ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = '', ...props }: React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className={`text-lg font-medium tracking-tight text-foreground ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = '', ...props }: React.ComponentPropsWithoutRef<'p'>) {
  return <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}

export function CardFooter({ className = '', ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />;
}

// Table components
export function Table({ className = '', ...props }: React.ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="relative w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
    </div>
  );
}

export function TableHeader({ className = '', ...props }: React.ComponentPropsWithoutRef<'thead'>) {
  return <thead className={`border-b border-border bg-muted/40 ${className}`} {...props} />;
}

export function TableBody({ className = '', ...props }: React.ComponentPropsWithoutRef<'tbody'>) {
  return <tbody className={`divide-y divide-border ${className}`} {...props} />;
}

export function TableFooter({ className = '', ...props }: React.ComponentPropsWithoutRef<'tfoot'>) {
  return (
    <tfoot className={`border-t border-border bg-muted/50 font-medium ${className}`} {...props} />
  );
}

export function TableRow({ className = '', ...props }: React.ComponentPropsWithoutRef<'tr'>) {
  return (
    <tr
      className={`border-b border-border transition-colors hover:bg-accent/40 data-[state=selected]:bg-muted ${className}`}
      {...props}
    />
  );
}

export function TableHead({ className = '', ...props }: React.ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  );
}

export function TableCell({ className = '', ...props }: React.ComponentPropsWithoutRef<'td'>) {
  return <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`} {...props} />;
}

// Badge
export function Badge({
  className = '',
  variant = 'default',
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
}) {
  const baseStyles = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2';
  const variantStyles = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/85',
    outline: 'text-foreground border-border bg-transparent',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    success: 'border-transparent bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
  };

  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props} />;
}

// Dialog Modal Trigger structures styled dynamically
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/35 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />
      {/* Dialog body */}
      <div className="relative z-50 w-full max-w-md scale-100 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg transition-all m-4">
        <div className="flex flex-col space-y-1.5 pb-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <span className="sr-only">Close</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}

// Custom Input with proper ring and focus states
export const Input = React.forwardRef<HTMLInputElement, React.ComponentPropsWithoutRef<'input'>>(
  ({ className = '', type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Custom Textarea
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentPropsWithoutRef<'textarea'>>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

// Custom Select Simple
export const Select = React.forwardRef<HTMLSelectElement, React.ComponentPropsWithoutRef<'select'>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = 'Select';

// Breadcrumbs
export function Breadcrumbs({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-xs font-semibold text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && <span className="mx-2 text-muted-foreground/40 font-normal">/</span>}
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-foreground font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Reusable page container
export function PageContainer({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`space-y-6 lg:space-y-8 max-w-7xl mx-auto px-1 sm:px-3 lg:px-4 py-4 ${className}`}>
      {children}
    </div>
  );
}

// Reusable dashboard stat cards
export function StatCard({
  title,
  value,
  description,
  growth,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description?: string;
  growth?: { value: number; isPositive: boolean };
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {(description || growth) && (
          <p className="text-xs text-muted-foreground mt-1">
            {growth && (
              <span className={`font-semibold mr-1.5 ${growth.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                {growth.isPositive ? '+' : ''}{growth.value}%
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Table wrapper
export function TableWrapper({ children, title, description, actions }: { children: React.ReactNode; title?: string; description?: string; actions?: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      {(title || description || actions) && (
        <CardHeader className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-border bg-muted/20 p-5">
          <div className="space-y-0.5">
            {title && <CardTitle className="text-base font-semibold">{title}</CardTitle>}
            {description && <CardDescription className="text-xs">{description}</CardDescription>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </CardHeader>
      )}
      <div className="overflow-x-auto">
        {children}
      </div>
    </Card>
  );
}

// Empty State
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 py-16 rounded-2xl border border-dashed border-border bg-card">
      {Icon && (
        <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1.5 mb-5 leading-normal">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Loading Skeleton
export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 w-full bg-muted/40 rounded-lg" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 w-full bg-muted/20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Button component conforming to shadcn specs
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'> & {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]';
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground text-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 text-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

// Label component conforming to shadcn specs
export function Label({ className = '', ...props }: React.ComponentPropsWithoutRef<'label'>) {
  return (
    <label
      className={`text-xs font-semibold leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}

// Checkbox component conforming to shadcn specs
export const Checkbox = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<'input'>, 'type'>
>(({ className = '', ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 shrink-0 rounded-sm border border-primary text-primary ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Checkbox.displayName = 'Checkbox';

// Separator component conforming to shadcn specs
export function Separator({ className = '', orientation = 'horizontal', ...props }: React.ComponentPropsWithoutRef<'div'> & { orientation?: 'horizontal' | 'vertical' }) {
  return (
    <div
      className={`shrink-0 bg-border ${orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'} ${className}`}
      {...props}
    />
  );
}


