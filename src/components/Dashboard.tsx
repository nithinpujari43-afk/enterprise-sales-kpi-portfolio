/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, Cell, PieChart, Pie 
} from "recharts";
import { 
  Briefcase, TrendingUp, DollarSign, ShoppingCart, Users, ArrowUpRight, ArrowDownRight, 
  Award, Globe, Package, Sliders, CheckCircle 
} from "lucide-react";
import { cleanOrders, customers, products, salesReps, regions } from "../data";

export default function Dashboard() {
  const [activePage, setActivePage] = useState<"overview" | "products" | "customers" | "regions" | "reps">("overview");
  
  // Dashboard Interactive Filters
  const [selectedSegment, setSelectedSegment] = useState<"all" | "Enterprise" | "Mid-Market" | "SMB">("all");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "Cloud SaaS" | "Hardware Hardware" | "Software License" | "Professional Services">("all");

  // ==========================================
  // DYNAMIC MATH PIPELINE FOR METRICS & CHARTS
  // ==========================================
  
  // Filtered orders based on selected top filters
  const filteredCleanOrders = useMemo(() => {
    return cleanOrders.filter(order => {
      // Find customer segment
      const customer = customers.find(c => c.id === order.customerId);
      const segmentMatches = selectedSegment === "all" || (customer && customer.segment === selectedSegment);

      // Find product category
      const product = products.find(p => p.id === order.productId);
      const categoryMatches = selectedCategory === "all" || (product && product.category === selectedCategory);

      return segmentMatches && categoryMatches;
    });
  }, [selectedSegment, selectedCategory]);

  // Aggregate global clean summaries
  const stats = useMemo(() => {
    const totalRev = filteredCleanOrders.reduce((sum, o) => sum + o.revenue, 0);
    const totalProfit = filteredCleanOrders.reduce((sum, o) => sum + o.profit, 0);
    const margin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;
    const ordersCount = filteredCleanOrders.length;
    
    // Distinct customers count
    const uniqCusts = new Set(filteredCleanOrders.map(o => o.customerId));
    const customerCount = uniqCusts.size;

    const rawAov = ordersCount > 0 ? totalRev / ordersCount : 0;

    return {
      totalRev,
      totalProfit,
      margin,
      ordersCount,
      customerCount,
      aov: rawAov
    };
  }, [filteredCleanOrders]);

  // Chart Data Month-by-Month
  const monthlyTimelineChart = useMemo(() => {
    const monthBuckets: Record<string, { revenue: number; profit: number; orderCount: number }> = {};
    
    // Sort orders sequentially by date
    const sorted = [...filteredCleanOrders].sort((a, b) => a.orderDate.localeCompare(b.orderDate));
    
    sorted.forEach(o => {
      // Date is standard YYYY-MM-DD
      const dateParts = o.orderDate.split("-");
      const monthIndex = parseInt(dateParts[1]);
      const yearStr = dateParts[0].substring(2); // "25" or "26"
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const key = `${monthNames[monthIndex - 1]} '${yearStr}`;

      if (!monthBuckets[key]) {
        monthBuckets[key] = { revenue: 0, profit: 0, orderCount: 0 };
      }
      monthBuckets[key].revenue += o.revenue;
      monthBuckets[key].profit += o.profit;
      monthBuckets[key].orderCount += 1;
    });

    return Object.keys(monthBuckets).map(k => ({
      month: k,
      Revenue: monthBuckets[k].revenue,
      Profit: monthBuckets[k].profit,
      Orders: monthBuckets[k].orderCount
    }));
  }, [filteredCleanOrders]);

  // Product category breakdown data for Pie chart
  const categorySummaryChart = useMemo(() => {
    const categories: Record<string, number> = {};
    filteredCleanOrders.forEach(o => {
      const p = products.find(prod => prod.id === o.productId);
      const cat = p ? p.category : "Unknown";
      categories[cat] = (categories[cat] || 0) + o.revenue;
    });

    return Object.keys(categories).map(k => ({
      name: k.replace(" Hardware", "").replace(" Suite", ""),
      value: categories[k]
    }));
  }, [filteredCleanOrders]);

  // Regional breakdown
  const regionalSummaryChart = useMemo(() => {
    const regionRevs: Record<string, number> = {};
    filteredCleanOrders.forEach(o => {
      const rep = salesReps.find(r => r.id === o.salesRepId);
      const reg = rep ? regions.find(region => region.id === rep.regionId) : null;
      const regName = reg ? reg.name : "Other";
      regionRevs[regName] = (regionRevs[regName] || 0) + o.revenue;
    });

    return Object.keys(regionRevs).map(k => ({
      name: k.split(" ")[0], // Keep abbreviation short
      Revenue: regionRevs[k]
    }));
  }, [filteredCleanOrders]);

  // ==========================================
  // VIEW SUB-PAGES COMPONENT PIECES
  // ==========================================

  const COLORS = ["#059669", "#0284c7", "#f59e0b", "#e11d48"];

  return (
    <div className="space-y-6" id="dashboard-main-app">
      {/* GLOBAL INTERACTIVE DYNAMIC SLICERS BAR */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#34d399] flex items-center gap-1">
            <Sliders className="w-3 h-3" />
            Global Report Filter Slicers 
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
            Aura Corporate Executive Dashboard
          </h2>
          <p className="text-xs text-slate-450 leading-none">Interactively slice database values using Customer Segmentation or Product SKU properties.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Customer segment filter */}
          <div className="space-y-1">
            <label className="block text-[9px] uppercase font-bold text-slate-450 tracking-wider">Customer Segment</label>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value as any)}
              className="bg-slate-820 border border-slate-700 rounded-lg text-xs font-semibold py-1.5 px-3 focus:outline-none focus:border-emerald-400 text-slate-200"
            >
              <option value="all">🌐 All Segments</option>
              <option value="Enterprise">💼 Enterprise Only</option>
              <option value="Mid-Market">🏢 Mid-Market Only</option>
              <option value="SMB">🛒 SMB Only</option>
            </select>
          </div>

          {/* Product Category filter */}
          <div className="space-y-1">
            <label className="block text-[9px] uppercase font-bold text-slate-450 tracking-wider">Product Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-slate-820 border border-slate-700 rounded-lg text-xs font-semibold py-1.5 px-3 focus:outline-none focus:border-emerald-400 text-slate-200"
            >
              <option value="all">📦 All Categories</option>
              <option value="Cloud SaaS">☁️ Cloud SaaS</option>
              <option value="Hardware Hardware">💻 Hardware Appliance</option>
              <option value="Software License">🔑 Software License</option>
              <option value="Professional Services">🚀 Prof Services</option>
            </select>
          </div>
        </div>
      </div>

      {/* DASHBOARD PAGE NAVIGATION TAB MENU */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {[
          { id: "overview", label: "Executive Overview", icon: TrendingUp },
          { id: "products", label: "Product Analysis", icon: Package },
          { id: "customers", label: "Customer Profiles", icon: Users },
          { id: "regions", label: "Regional Territories", icon: Globe },
          { id: "reps", label: "Sales Rep Targets", icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id as any)}
              className={`py-2 px-4 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 ${
                activePage === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* INTERACTIVE KPI STRIP CARDSERIES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Cleaned Gross Revenue", value: `$${stats.totalRev.toLocaleString()}`, change: "+32.2% YoY", isPositive: true, icon: DollarSign, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
          { label: "Net Operating Profit", value: `$${stats.totalProfit.toLocaleString()}`, change: "Target Pacing", isPositive: true, icon: DollarSign, color: "text-blue-500 bg-blue-50 border-blue-100" },
          { label: "Gross Profit Margin %", value: `${stats.margin.toFixed(1)}%`, change: "Enterprise Limit", isPositive: true, icon: TrendingUp, color: "text-purple-500 bg-purple-50 border-purple-100" },
          { label: "Audit Sales Orders", value: stats.ordersCount, change: "+14.5% Cleaned", isPositive: true, icon: ShoppingCart, color: "text-amber-500 bg-amber-50 border-amber-100" },
          { label: "Active Buyers", value: `${stats.customerCount} Accounts`, change: "60% Repeat Rate", isPositive: true, icon: Users, color: "text-rose-500 bg-rose-50 border-rose-100" }
        ].map((kpi, idx) => {
          const IconObj = kpi.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-150 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-550 uppercase font-bold tracking-wider leading-none">{kpi.label}</span>
                <span className={`p-1.5 rounded-lg border text-xs ${kpi.color}`}>
                  <IconObj className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-gray-800 leading-none">{kpi.value}</p>
                <div className="flex items-center gap-1 text-[10px] text-gray-410">
                  <span className={kpi.isPositive ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>{kpi.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RENDER PAGES SELECTIVELY */}
      <div className="transition-all duration-300">
        
        {/* PAGE 1: EXECUTIVE OVERVIEW */}
        {activePage === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-overview-page">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Cleaned Revenue & profit Margin Timeline</h3>
                  <p className="text-[10px] text-gray-400">Month-over-month performance. Visualizes constant scaling margin growth against operational expenses.</p>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 rounded px-2 py-0.5 font-bold">MoM Growth Trends</span>
              </div>

              {/* Monthly line chart */}
              <div className="h-[280px]">
                {monthlyTimelineChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTimelineChart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px" }} />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line type="monotone" dataKey="Revenue" stroke="#059669" strokeWidth={2.5} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-405 italic">Select different filters to populate timeline data</div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-5">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">Product Categories Share</h3>
                <p className="text-[10px] text-gray-400">Breakdown of gross sales contributions across cloud and physical offerings.</p>
              </div>

              {/* Category pie chart */}
              <div className="h-[200px] flex items-center justify-center relative">
                {categorySummaryChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categorySummaryChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categorySummaryChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Billed Sales"]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-405 italic">No data matched</div>
                )}
                {/* Total centered marker */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Sales</span>
                  <span className="text-sm font-extrabold text-slate-800">${(stats.totalRev / 1000).toFixed(1)}K</span>
                </div>
              </div>

              {/* Pie Legends */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-500 font-semibold">
                {categorySummaryChart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="truncate">{item.name}: <b>${(item.value / 1000).toFixed(1)}k</b></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: PRODUCT ANALYSIS */}
        {activePage === "products" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6" id="dashboard-products-page">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">Product SKU Financial Portfolio Grid</h3>
                <p className="text-xs text-gray-400">Detailed line item cost structure, margins tracking, and volume evaluations.</p>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold py-1 px-3 rounded-full">
                {products.length} catalog offerings
              </span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-b text-[10px] uppercase">
                    <th className="p-3">SKU Code</th>
                    <th className="p-3 text-left">Product Name</th>
                    <th className="p-3 text-left">Group Class</th>
                    <th className="p-3">Invoiced Price</th>
                    <th className="p-3">Cogs Expense</th>
                    <th className="p-3">B2B Net Margin</th>
                    <th className="p-3">Units Sold</th>
                    <th className="p-3">Aggregate Revenue</th>
                    <th className="p-3 text-right">Profit Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {products.map((p) => {
                    // Calculate dynamic physical units sold from cleanOrders
                    const matchedOrders = filteredCleanOrders.filter(o => o.productId === p.id);
                    const unitsSold = matchedOrders.reduce((sum, o) => sum + o.quantity, 0);
                    const totalSKURevenue = matchedOrders.reduce((sum, o) => sum + o.revenue, 0);
                    const totalSKUProfit = matchedOrders.reduce((sum, o) => sum + o.profit, 0);

                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-semibold text-slate-800">{p.id}</td>
                        <td className="p-3 font-sans text-slate-700 text-left font-medium">{p.name}</td>
                        <td className="p-3 text-left">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase font-sans bg-slate-100 text-slate-700">
                            {p.category.split(" ")[0]}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 font-bold">${p.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-slate-500">${p.cost.toLocaleString()}</td>
                        <td className="p-3">
                          <span className={`font-bold ${p.margin >= 0.75 ? "text-emerald-600" : p.margin >= 0.40 ? "text-blue-600" : "text-amber-600"}`}>
                            {(p.margin * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-bold">{unitsSold}</td>
                        <td className="p-3 text-slate-800 font-bold">${totalSKURevenue.toLocaleString()}</td>
                        <td className="p-3 text-right font-sans font-bold text-emerald-700">${totalSKUProfit.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGE 3: CUSTOMER ANALYSIS */}
        {activePage === "customers" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6" id="dashboard-customers-page">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-800">B2B Account Buyers Portfolio Leaderboard</h3>
              <p className="text-xs text-gray-400">Rankings based on total invoiced billing, repeat purchasing frequency, and segment classification.</p>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b text-[10px] uppercase">
                    <th className="p-3">Rank</th>
                    <th className="p-3 text-left">Customer Name</th>
                    <th className="p-3 text-left">Industry Focus</th>
                    <th className="p-3">Segment Class</th>
                    <th className="p-3">Contracts Signed</th>
                    <th className="p-3 font-semibold">Total Revenue Purchased</th>
                    <th className="p-3 text-right">Relationship Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-105 font-mono text-[11px]">
                  {customers.map((c, index) => {
                    const matchedOrders = filteredCleanOrders.filter(o => o.customerId === c.id);
                    const contractCount = matchedOrders.length;
                    const customerBilledRev = matchedOrders.reduce((sum, o) => sum + o.revenue, 0);

                    return (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-bold text-slate-400">{index + 1}</td>
                        <td className="p-3 font-sans font-bold text-slate-800 text-left">{c.name}</td>
                        <td className="p-3 font-sans text-slate-500 text-left">{c.industry}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-sans ${
                            c.segment === "Enterprise" ? "bg-rose-100 text-rose-800" : c.segment === "Mid-Market" ? "bg-blue-105 text-blue-800 font-semibold" : "bg-amber-100 text-amber-800"
                          }`}>
                            {c.segment}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-bold">{contractCount} Orders</td>
                        <td className="p-3 text-slate-900 font-bold">${customerBilledRev.toLocaleString()}</td>
                        <td className="p-3 text-right font-sans text-slate-400">{c.joinedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGE 4: REGIONAL ANALYSIS */}
        {activePage === "regions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-regions-page">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-gray-800">Regional Billed Revenue Contribution</h3>
                <p className="text-[10px] text-gray-400">Total volume distributed by domestic division. Highlights high-attainment areas.</p>
              </div>

              {/* Regional Chart */}
              <div className="h-[250px]">
                {regionalSummaryChart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalSummaryChart} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, "Billed Revenue"]} />
                      <Legend wrapperStyle={{ fontSize: "11.5px" }} />
                      <Bar dataKey="Revenue" name="Territory Revenue" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">Select filters to populate.</div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-800">Territory Divisions Directory</h3>
              <div className="divide-y divide-slate-100">
                {regions.map((reg) => {
                  // Find all reps belonging to this region
                  const repIds = salesReps.filter(r => r.regionId === reg.id).map(r => r.id);
                  const matchedRegionOrders = filteredCleanOrders.filter(o => repIds.includes(o.salesRepId));
                  const regRevTotal = matchedRegionOrders.reduce((sum, o) => sum + o.revenue, 0);

                  return (
                    <div key={reg.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider font-mono bg-slate-100 text-slate-650 font-bold px-2 py-0.5 rounded inline-block">
                          {reg.id}
                        </span>
                        <p className="font-bold text-slate-800 text-xs leading-none mt-1">{reg.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Head Director: <b>{reg.manager}</b></p>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        ${regRevTotal.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: SALES REPS */}
        {activePage === "reps" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6" id="dashboard-reps-page">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-gray-800">Sales Representative Quota Attainment Ledger</h3>
              <p className="text-xs text-gray-400">Actual clean billing achieved compared to pre-set fiscal contract targets.</p>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-semibold border-b text-[10px] uppercase">
                    <th className="p-3 text-left">Sales Representative</th>
                    <th className="p-3">Local Division</th>
                    <th className="p-3 col-span-2">Seniority</th>
                    <th className="p-3">Annual Quota Quota</th>
                    <th className="p-3">Actual Closed B2B</th>
                    <th className="p-3 text-right">Quota Target Attainment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {salesReps.map((rep) => {
                    const repRegionObj = regions.find(reg => reg.id === rep.regionId);
                    const matchedRepOrders = filteredCleanOrders.filter(o => o.salesRepId === rep.id);
                    const closedRepRevSum = matchedRepOrders.reduce((sum, o) => sum + o.revenue, 0);
                    const attainmentPct = (closedRepRevSum / rep.annualTarget) * 105;

                    return (
                      <tr key={rep.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-sans font-bold text-slate-800 text-left">{rep.name}</td>
                        <td className="p-3 font-sans text-slate-500 text-left">{(repRegionObj ? repRegionObj.name : rep.regionId).split(" ")[0]}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase font-sans ${
                            rep.seniority === "Senior" ? "bg-violet-100 text-violet-800" : rep.seniority === "Mid-Level" ? "bg-sky-100 text-sky-850" : "bg-neutral-100 text-neutral-600"
                          }`}>
                            {rep.seniority}
                          </span>
                        </td>
                        <td className="p-3 text-slate-550 font-bold">${rep.annualTarget.toLocaleString()}</td>
                        <td className="p-3 text-slate-800 font-bold">${closedRepRevSum.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <span className={`font-bold font-sans ${attainmentPct >= 100 ? "text-emerald-600" : attainmentPct >= 75 ? "text-blue-600" : "text-rose-600"}`}>
                              {attainmentPct.toFixed(1)}%
                            </span>
                            <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden inline-block border border-slate-150">
                              <div 
                                className={`h-full ${attainmentPct >= 100 ? "bg-emerald-500" : attainmentPct >= 75 ? "bg-blue-500" : "bg-rose-500"}`}
                                style={{ width: `${Math.min(attainmentPct, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
