import { 
  Cog, 
  Package, 
  CircleDot, 
  Wrench, 
  Paintbrush, 
  FlaskConical, 
  BoxSelect, 
  Truck,
  CheckCircle2
} from "lucide-react";

type Milestone = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "completed" | "in-progress" | "pending";
  daysEstimate: string;
};

const milestones: Milestone[] = [
  { id: "engineering", label: "Engineering", icon: Cog, status: "completed", daysEstimate: "3-5 days" },
  { id: "materials", label: "Materials Order", icon: Package, status: "completed", daysEstimate: "5-10 days" },
  { id: "core-winding", label: "Core Winding", icon: CircleDot, status: "in-progress", daysEstimate: "7-14 days" },
  { id: "assembly", label: "Assembly", icon: Wrench, status: "pending", daysEstimate: "5-7 days" },
  { id: "paint", label: "Paint", icon: Paintbrush, status: "pending", daysEstimate: "2-3 days" },
  { id: "testing", label: "Testing", icon: FlaskConical, status: "pending", daysEstimate: "2-4 days" },
  { id: "packaging", label: "Packaging", icon: BoxSelect, status: "pending", daysEstimate: "1-2 days" },
  { id: "shipping", label: "Shipping", icon: Truck, status: "pending", daysEstimate: "3-7 days" },
];

const OrderTimeline = () => {
  return (
    <div className="w-[480px] p-5 bg-card border border-border rounded-xl shadow-lg">
      <h4 className="font-display text-lg text-foreground mb-2 text-center">
        Real-Time Order Tracking
      </h4>
      <p className="text-xs text-muted-foreground text-center mb-5">
        Example: 500 kVA Transformer
      </p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[22px] top-3 bottom-3 w-0.5 bg-border" />
        
        {/* Progress overlay */}
        <div 
          className="absolute left-[22px] top-3 w-0.5 bg-primary transition-all duration-500"
          style={{ height: `calc(${(2 / milestones.length) * 100}% + 8px)` }}
        />

        <div className="space-y-1">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isCompleted = milestone.status === "completed";
            const isInProgress = milestone.status === "in-progress";
            
            return (
              <div
                key={milestone.id}
                className={`
                  relative flex items-center gap-4 p-3 rounded-lg transition-all duration-300
                  ${isInProgress ? "bg-primary/10 border border-primary/30" : ""}
                  ${isCompleted ? "opacity-80" : ""}
                `}
              >
                {/* Icon circle */}
                <div
                  className={`
                    relative z-10 w-11 h-11 rounded-full flex items-center justify-center shrink-0
                    transition-all duration-300
                    ${isCompleted ? "bg-primary" : ""}
                    ${isInProgress ? "bg-primary ring-4 ring-primary/30" : ""}
                    ${!isCompleted && !isInProgress ? "bg-muted border-2 border-border" : ""}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 ${
                        isInProgress ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                  )}
                  
                  {/* Pulse animation for in-progress */}
                  {isInProgress && (
                    <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-medium text-sm ${
                        isInProgress
                          ? "text-primary"
                          : isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {milestone.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {milestone.daysEstimate}
                    </span>
                  </div>
                  
                  {isInProgress && (
                    <div className="mt-1.5">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full animate-pulse"
                          style={{ width: "65%" }}
                        />
                      </div>
                      <span className="text-[10px] text-primary mt-1 block">
                        In Progress • Est. 4 days remaining
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          Total Lead Time: <span className="text-foreground font-medium">28-52 days</span>
        </span>
        <span className="text-primary font-medium">
          Live Updates 24/7
        </span>
      </div>
    </div>
  );
};

export default OrderTimeline;
