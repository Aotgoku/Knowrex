(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/knowrex/components/SourceCitation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SourceCitation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
/**
 * Get relevance level info
 * Note: Semantic similarity scores of 25-55% are NORMAL and indicate good matches
 * This is NOT an accuracy score - it measures how semantically similar the query is to the content
 */ function getConfidenceInfo(score) {
    // Adjusted for realistic semantic similarity scores
    if (score >= 0.45) return {
        level: 'high',
        color: '#22c55e',
        label: '✓ Excellent match'
    };
    if (score >= 0.35) return {
        level: 'medium',
        color: '#3b82f6',
        label: '✓ Good match'
    };
    if (score >= 0.25) return {
        level: 'low',
        color: '#eab308',
        label: '✓ Found'
    };
    return {
        level: 'none',
        color: '#ef4444',
        label: 'Low relevance'
    };
}
function SourceCitation({ sources, confidence, showSources = true }) {
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [expandedSource, setExpandedSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    if (!sources || sources.length === 0 || !showSources) {
        return null;
    }
    const confidenceInfo = getConfidenceInfo(confidence);
    const uniqueDocuments = [
        ...new Set(sources.map((s)=>s.documentName))
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-3 pt-3 border-t",
        style: {
            borderColor: 'var(--border-color)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsExpanded(!isExpanded),
                className: "flex items-center justify-between w-full text-left group",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-medium",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: [
                                    "📚 Sources (",
                                    uniqueDocuments.length,
                                    " document",
                                    uniqueDocuments.length !== 1 ? 's' : '',
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs px-2 py-0.5 rounded-full",
                                style: {
                                    backgroundColor: `${confidenceInfo.color}20`,
                                    color: confidenceInfo.color
                                },
                                children: confidenceInfo.label
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 56,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 text-xs",
                        style: {
                            color: 'var(--muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isExpanded ? 'Hide' : 'Show'
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            !isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap gap-1 mt-2",
                children: uniqueDocuments.map((docName, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs px-2 py-1 rounded-md flex items-center gap-1",
                        style: {
                            backgroundColor: 'var(--background)',
                            color: 'var(--muted)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 88,
                                columnNumber: 15
                            }, this),
                            docName
                        ]
                    }, index, true, {
                        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                        lineNumber: 80,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                lineNumber: 78,
                columnNumber: 9
            }, this),
            isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 space-y-2",
                children: sources.map((source, index)=>{
                    const sourceConfidence = getConfidenceInfo(source.score);
                    const isSourceExpanded = expandedSource === source.chunkId;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "rounded-lg border overflow-hidden",
                        style: {
                            backgroundColor: 'var(--background)',
                            borderColor: 'var(--border-color)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setExpandedSource(isSourceExpanded ? null : source.chunkId || `source-${index}`),
                                className: "flex items-center justify-between w-full p-3 text-left hover:bg-opacity-50",
                                style: {
                                    backgroundColor: 'var(--card-bg)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "w-4 h-4",
                                                style: {
                                                    color: 'var(--primary)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                                lineNumber: 118,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                style: {
                                                    color: 'var(--foreground)'
                                                },
                                                children: source.documentName
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                                lineNumber: 119,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800",
                                                style: {
                                                    color: 'var(--muted)'
                                                },
                                                children: [
                                                    "Chunk #",
                                                    source.chunkId.split('-chunk-')[1] || index + 1
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                                lineNumber: 122,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs px-1.5 py-0.5 rounded",
                                                style: {
                                                    backgroundColor: `${sourceConfidence.color}20`,
                                                    color: sourceConfidence.color
                                                },
                                                children: [
                                                    Math.round(source.score * 100),
                                                    "% match"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                        lineNumber: 117,
                                        columnNumber: 19
                                    }, this),
                                    isSourceExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                                        className: "w-4 h-4",
                                        style: {
                                            color: 'var(--muted)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                        lineNumber: 139,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "w-4 h-4",
                                        style: {
                                            color: 'var(--muted)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                        lineNumber: 141,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 112,
                                columnNumber: 17
                            }, this),
                            isSourceExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 border-t",
                                style: {
                                    borderColor: 'var(--border-color)'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm leading-relaxed whitespace-pre-wrap",
                                    style: {
                                        color: 'var(--foreground)'
                                    },
                                    children: source.text
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                    lineNumber: 148,
                                    columnNumber: 21
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                                lineNumber: 147,
                                columnNumber: 19
                            }, this)
                        ]
                    }, source.chunkId || index, true, {
                        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                        lineNumber: 103,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
                lineNumber: 97,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/knowrex/components/SourceCitation.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_s(SourceCitation, "eopYcx32vjqoogpl0o59fi9U1W8=");
_c = SourceCitation;
var _c;
__turbopack_context__.k.register(_c, "SourceCitation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/knowrex/components/ChatMessage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$SourceCitation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/components/SourceCitation.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ChatMessage({ message, isLatest = false, showSources = true, onEscalate }) {
    _s();
    const isUser = message.role === 'user';
    const [isEscalating, setIsEscalating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [escalated, setEscalated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Format the timestamp to show time in a readable format
    const formatTime = (date)=>{
        return new Date(date).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    const handleEscalate = async ()=>{
        if (!onEscalate || isEscalating || escalated) return;
        setIsEscalating(true);
        try {
            await onEscalate(message);
            setEscalated(true);
        } catch (error) {
            console.error('Failed to escalate:', error);
        } finally{
            setIsEscalating(false);
        }
    };
    // Check if we should show escalation UI
    const showEscalationUI = !isUser && message.escalation && (message.escalation.shouldEscalate || message.escalation.offerEscalation);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''} ${isLatest ? 'message-enter' : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md ${isUser ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`,
                children: isUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                    className: "w-4 h-4 text-white"
                }, void 0, false, {
                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                    lineNumber: 76,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                    className: "w-4 h-4 text-white"
                }, void 0, false, {
                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                    lineNumber: 78,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%] sm:max-w-[70%]`,
                children: [
                    !isUser && (message.usedRAG !== undefined || message.sources && message.sources.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 mb-1 text-xs",
                        style: {
                            color: 'var(--muted)'
                        },
                        children: message.usedRAG || message.sources && message.sources.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                    className: "w-3 h-3 text-indigo-500"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                    lineNumber: 89,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-indigo-500",
                                    children: "Using documents"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                    lineNumber: 90,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                    className: "w-3 h-3"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                    lineNumber: 94,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "General knowledge"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                    lineNumber: 95,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `px-4 py-3 rounded-2xl shadow-sm ${isUser ? 'rounded-tr-md text-white' : 'rounded-tl-md'}`,
                        style: {
                            background: isUser ? 'var(--user-bubble)' : 'var(--ai-bubble)',
                            color: isUser ? 'white' : 'var(--ai-text)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "prose-chat text-sm sm:text-base whitespace-pre-wrap break-words",
                                children: message.content
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                lineNumber: 117,
                                columnNumber: 11
                            }, this),
                            !isUser && message.sources && message.sources.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$SourceCitation$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                sources: message.sources,
                                confidence: message.confidence ?? message.sources[0]?.score ?? 0.3,
                                showSources: showSources
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this),
                            showEscalationUI && !escalated && !message.escalationId && onEscalate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `mt-3 pt-3 border-t ${message.escalation?.shouldEscalate ? 'border-orange-200 bg-orange-50' : 'border-yellow-200 bg-yellow-50'} -mx-4 -mb-3 px-4 pb-3 rounded-b-2xl`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-2",
                                    children: [
                                        message.escalation?.shouldEscalate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                            className: "w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                            lineNumber: 139,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                            className: "w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                            lineNumber: 141,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `text-xs ${message.escalation?.shouldEscalate ? 'text-orange-700' : 'text-yellow-700'}`,
                                                    children: message.escalation?.message || (message.escalation?.shouldEscalate ? 'This question may need human expertise.' : `My confidence is ${Math.round((message.confidence || 0) * 100)}%. Would you like to speak with a human?`)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleEscalate,
                                                    disabled: isEscalating,
                                                    className: `mt-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${message.escalation?.shouldEscalate ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-yellow-500 text-white hover:bg-yellow-600'} disabled:opacity-50 disabled:cursor-not-allowed`,
                                                    children: isEscalating ? 'Requesting...' : '👤 Get Human Help'
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                            lineNumber: 143,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                    lineNumber: 137,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            (escalated || message.escalationId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-3 pt-3 border-t border-blue-200 bg-blue-50 -mx-4 -mb-3 px-4 pb-3 rounded-b-2xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start gap-2 text-blue-700 text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce",
                                                        style: {
                                                            animationDelay: '0ms'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce",
                                                        style: {
                                                            animationDelay: '150ms'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce",
                                                        style: {
                                                            animationDelay: '300ms'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                        lineNumber: 177,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                lineNumber: 174,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium",
                                                    children: "Waiting for human expert..."
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-1 opacity-80",
                                                    children: "Your question has been sent to our support team. You'll see their response here shortly."
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                                    lineNumber: 182,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                        lineNumber: 102,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs mt-1 px-1",
                        style: {
                            color: 'var(--muted)'
                        },
                        children: formatTime(message.timestamp)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/knowrex/components/ChatMessage.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(ChatMessage, "pYlpnv6VSAICktcuIZ5H1szsWeM=");
_c = ChatMessage;
var _c;
__turbopack_context__.k.register(_c, "ChatMessage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/knowrex/components/ChatInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
// Maximum characters allowed in a single message
const MAX_CHARACTERS = 2000;
function ChatInput({ onSendMessage, isLoading, disabled = false }) {
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Auto-resize textarea based on content
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatInput.useEffect": ()=>{
            const textarea = textareaRef.current;
            if (textarea) {
                // Reset height to auto to get the correct scrollHeight
                textarea.style.height = 'auto';
                // Set height to scrollHeight, but cap at 150px
                textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
            }
        }
    }["ChatInput.useEffect"], [
        message
    ]);
    // Focus textarea when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatInput.useEffect": ()=>{
            if (!isLoading && textareaRef.current) {
                textareaRef.current.focus();
            }
        }
    }["ChatInput.useEffect"], [
        isLoading
    ]);
    /**
   * Handle form submission
   * Trims the message and sends it if not empty
   */ const handleSubmit = ()=>{
        const trimmedMessage = message.trim();
        // Don't send empty messages or if loading
        if (!trimmedMessage || isLoading || disabled) return;
        // Don't exceed character limit
        if (trimmedMessage.length > MAX_CHARACTERS) return;
        onSendMessage(trimmedMessage);
        setMessage('');
        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };
    /**
   * Handle keyboard events
   * Enter sends message, Shift+Enter adds new line
   */ const handleKeyDown = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };
    /**
   * Handle input changes
   * Updates message state and respects character limit
   */ const handleChange = (e)=>{
        const value = e.target.value;
        // Allow typing but show warning if over limit
        setMessage(value);
    };
    const characterCount = message.length;
    const isOverLimit = characterCount > MAX_CHARACTERS;
    const isNearLimit = characterCount > MAX_CHARACTERS * 0.9;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-t p-4",
        style: {
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-4xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-end gap-2 p-2 rounded-2xl border transition-all duration-200",
                    style: {
                        backgroundColor: 'var(--input-bg)',
                        borderColor: isOverLimit ? 'var(--error)' : 'var(--border-color)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            ref: textareaRef,
                            value: message,
                            onChange: handleChange,
                            onKeyDown: handleKeyDown,
                            placeholder: isLoading ? "Waiting for response..." : "Type your message...",
                            disabled: isLoading || disabled,
                            rows: 1,
                            className: "flex-1 resize-none bg-transparent px-2 py-2 text-sm sm:text-base focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed custom-scrollbar",
                            style: {
                                color: 'var(--foreground)',
                                minHeight: '44px',
                                maxHeight: '150px'
                            },
                            "aria-label": "Message input"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleSubmit,
                            disabled: !message.trim() || isLoading || disabled || isOverLimit,
                            className: "flex-shrink-0 p-2 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-hover-effect focus-ring",
                            style: {
                                background: !message.trim() || isLoading || disabled || isOverLimit ? 'var(--border-color)' : 'var(--user-bubble)'
                            },
                            "aria-label": "Send message",
                            children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "w-5 h-5 text-white animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                className: "w-5 h-5 text-white"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                                lineNumber: 145,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mt-2 px-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs",
                            style: {
                                color: 'var(--muted)'
                            },
                            children: "Press Enter to send, Shift+Enter for new line"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `text-xs font-medium transition-colors ${isOverLimit ? 'text-red-500' : isNearLimit ? 'text-amber-500' : ''}`,
                            style: {
                                color: isOverLimit ? 'var(--error)' : isNearLimit ? '#f59e0b' : 'var(--muted)'
                            },
                            children: [
                                characterCount.toLocaleString(),
                                "/",
                                MAX_CHARACTERS.toLocaleString()
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
            lineNumber: 103,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/knowrex/components/ChatInput.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_s(ChatInput, "VSER48j+FrukPAG/uIytS5NVdYE=");
_c = ChatInput;
var _c;
__turbopack_context__.k.register(_c, "ChatInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/knowrex/components/TypingIndicator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TypingIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
'use client';
;
;
function TypingIndicator({ isVisible }) {
    // Don't render anything if not visible
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start gap-3 message-enter",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                    className: "w-4 h-4 text-white"
                }, void 0, false, {
                    fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
                lineNumber: 23,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 py-3 rounded-2xl rounded-tl-md shadow-sm",
                style: {
                    backgroundColor: 'var(--ai-bubble)',
                    color: 'var(--ai-text)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "typing-dot w-2 h-2 rounded-full bg-indigo-500",
                            style: {
                                opacity: 0.7
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "typing-dot w-2 h-2 rounded-full bg-indigo-500",
                            style: {
                                opacity: 0.7
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "typing-dot w-2 h-2 rounded-full bg-indigo-500",
                            style: {
                                opacity: 0.7
                            }
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
                    lineNumber: 35,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/knowrex/components/TypingIndicator.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_c = TypingIndicator;
var _c;
__turbopack_context__.k.register(_c, "TypingIndicator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/knowrex/components/RAGSettings.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RAGToggle",
    ()=>RAGToggle,
    "default",
    ()=>RAGSettingsPanel,
    "useRAGSettings",
    ()=>useRAGSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js [app-client] (ecmascript) <export default as SlidersHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
// ============================================
// RAG Settings Component
// Toggle and configure document search
// ============================================
const STORAGE_KEY = 'knowrex-rag-settings';
const SETTINGS_VERSION = 3; // Increment to reset user settings to new defaults
const DEFAULT_SETTINGS = {
    enabled: true,
    minConfidence: 0.25,
    showSources: true,
    selectedDocumentId: undefined
};
function useRAGSettings() {
    _s();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SETTINGS);
    const [isLoaded, setIsLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRAGSettings.useEffect": ()=>{
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Check version - reset if outdated
                    if (parsed.version !== SETTINGS_VERSION) {
                        // Old settings, use defaults
                        setSettings(DEFAULT_SETTINGS);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify({
                            ...DEFAULT_SETTINGS,
                            version: SETTINGS_VERSION
                        }));
                    } else {
                        setSettings(parsed);
                    }
                }
            } catch (e) {
                console.error('Failed to load RAG settings:', e);
            }
            setIsLoaded(true);
        }
    }["useRAGSettings.useEffect"], []);
    // Save to localStorage when settings change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useRAGSettings.useEffect": ()=>{
            if (isLoaded) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({
                        ...settings,
                        version: SETTINGS_VERSION
                    }));
                } catch (e) {
                    console.error('Failed to save RAG settings:', e);
                }
            }
        }
    }["useRAGSettings.useEffect"], [
        settings,
        isLoaded
    ]);
    return {
        settings,
        setSettings,
        isLoaded
    };
}
_s(useRAGSettings, "iE/2bUEMn95bVKBpvcCJJ50OYeY=");
function RAGSettingsPanel({ settings, onSettingsChange, isSearching = false, documentsCount = 0, documents = [] }) {
    _s1();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleToggle = ()=>{
        onSettingsChange({
            ...settings,
            enabled: !settings.enabled
        });
    };
    const handleConfidenceChange = (value)=>{
        onSettingsChange({
            ...settings,
            minConfidence: value / 100
        });
    };
    const handleShowSourcesChange = (show)=>{
        onSettingsChange({
            ...settings,
            showSources: show
        });
    };
    const handleDocumentChange = (documentId)=>{
        onSettingsChange({
            ...settings,
            selectedDocumentId: documentId === 'all' ? undefined : documentId
        });
    };
    // Get display name for selected document
    const getSelectedDocumentName = ()=>{
        if (!settings.selectedDocumentId) return 'All Documents';
        const doc = documents.find((d)=>d.id === settings.selectedDocumentId);
        return doc?.name || 'Unknown';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border rounded-lg overflow-hidden",
        style: {
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between p-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleToggle,
                                className: `relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.enabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`,
                                "aria-label": settings.enabled ? 'Disable document search' : 'Enable document search',
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${settings.enabled ? 'left-6' : 'left-0.5'}`
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                    lineNumber: 132,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 125,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    settings.enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                        className: "w-4 h-4 text-indigo-500"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 142,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "w-4 h-4",
                                        style: {
                                            color: 'var(--muted)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium",
                                        style: {
                                            color: 'var(--foreground)'
                                        },
                                        children: settings.enabled ? 'Search Documents' : 'General Knowledge'
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 146,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, this),
                            settings.enabled && isSearching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 text-xs text-indigo-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "w-3 h-3 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this),
                                    "Searching..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this),
                            settings.enabled && !isSearching && documentsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: [
                                    documentsCount,
                                    " document",
                                    documentsCount !== 1 ? 's' : '',
                                    " available"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 160,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsExpanded(!isExpanded),
                        className: "p-1.5 rounded-md hover:bg-opacity-10 hover:bg-gray-500 transition-colors",
                        style: {
                            color: 'var(--muted)'
                        },
                        "aria-label": "Toggle settings",
                        children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sliders$2d$horizontal$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SlidersHorizontal$3e$__["SlidersHorizontal"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                            lineNumber: 176,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-3 pt-1 border-t space-y-4",
                style: {
                    borderColor: 'var(--border-color)'
                },
                children: [
                    documents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium block mb-2",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: "Search in Document"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: settings.selectedDocumentId || 'all',
                                        onChange: (e)=>handleDocumentChange(e.target.value),
                                        className: "w-full px-3 py-2 pr-8 rounded-md text-sm appearance-none cursor-pointer",
                                        style: {
                                            backgroundColor: 'var(--background)',
                                            color: 'var(--foreground)',
                                            border: '1px solid var(--border-color)'
                                        },
                                        disabled: !settings.enabled,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "all",
                                                children: [
                                                    "📚 All Documents (",
                                                    documents?.length || 0,
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                                lineNumber: 205,
                                                columnNumber: 19
                                            }, this),
                                            documents && documents.map((doc)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: doc?.id || '',
                                                    children: [
                                                        "📄 ",
                                                        doc?.name && doc.name.length > 40 ? doc.name.substring(0, 40) + '...' : doc?.name || 'Unknown'
                                                    ]
                                                }, doc?.id || '', true, {
                                                    fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 21
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 194,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: "absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none",
                                        style: {
                                            color: 'var(--muted)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 212,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 193,
                                columnNumber: 15
                            }, this),
                            settings.selectedDocumentId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs mt-1 flex items-center gap-1",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 219,
                                        columnNumber: 19
                                    }, this),
                                    "Searching only in: ",
                                    getSelectedDocumentName()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 218,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                        lineNumber: 189,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-medium",
                                        style: {
                                            color: 'var(--muted)'
                                        },
                                        children: "Minimum Match Confidence"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 229,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-mono px-2 py-0.5 rounded",
                                        style: {
                                            backgroundColor: 'var(--background)',
                                            color: 'var(--foreground)'
                                        },
                                        children: [
                                            Math.round(settings.minConfidence * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 232,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 228,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "range",
                                min: "50",
                                max: "90",
                                step: "5",
                                value: Math.round(settings.minConfidence * 100),
                                onChange: (e)=>handleConfidenceChange(parseInt(e.target.value)),
                                className: "w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500",
                                style: {
                                    backgroundColor: 'var(--background)'
                                },
                                disabled: !settings.enabled
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between text-xs mt-1",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "More results"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 251,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Higher accuracy"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 250,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                        lineNumber: 227,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "text-xs font-medium",
                                style: {
                                    color: 'var(--muted)'
                                },
                                children: "Show source citations"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 258,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleShowSourcesChange(!settings.showSources),
                                className: `relative w-10 h-5 rounded-full transition-colors duration-200 ${settings.showSources ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`,
                                disabled: !settings.enabled,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${settings.showSources ? 'left-5' : 'left-0.5'}`
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                    lineNumber: 268,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                        lineNumber: 257,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs",
                        style: {
                            color: 'var(--muted)'
                        },
                        children: settings.enabled ? 'The AI will search your uploaded documents before answering questions.' : 'The AI will use general knowledge without searching your documents.'
                    }, void 0, false, {
                        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                lineNumber: 183,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
        lineNumber: 114,
        columnNumber: 5
    }, this);
}
_s1(RAGSettingsPanel, "FPNvbbHVlWWR4LKxxNntSxiIS38=");
_c = RAGSettingsPanel;
function RAGToggle({ enabled, onChange, isSearching = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: ()=>onChange(!enabled),
        className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${enabled ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`,
        title: enabled ? 'Document search enabled' : 'Document search disabled',
        children: [
            isSearching ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "w-3 h-3 animate-pulse"
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                lineNumber: 310,
                columnNumber: 9
            }, this) : enabled ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                className: "w-3 h-3"
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                lineNumber: 312,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                className: "w-3 h-3"
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                lineNumber: 314,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: enabled ? 'RAG' : 'AI'
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
                lineNumber: 316,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/knowrex/components/RAGSettings.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
_c1 = RAGToggle;
var _c, _c1;
__turbopack_context__.k.register(_c, "RAGSettingsPanel");
__turbopack_context__.k.register(_c1, "RAGToggle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/knowrex/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/zap.js [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/circle-question-mark.js [app-client] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/Desktop/knowrex/node_modules/lucide-react/dist/esm/icons/book-open.js [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$ChatMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/components/ChatMessage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/components/ChatInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$TypingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/components/TypingIndicator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$RAGSettings$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/knowrex/components/RAGSettings.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
// ============================================
// Knowrex - Main Chat Page with RAG Integration
// 
// This is the main chat interface component that:
// 1. Manages the chat state (messages, loading, errors)
// 2. Handles communication with the Gemini API
// 3. Integrates RAG for document-based answers
// 4. Provides a beautiful, responsive UI
// ============================================
// Key for localStorage persistence
const STORAGE_KEY = 'knowrex-chat-history';
// Sample questions to help users get started
const SAMPLE_QUESTIONS = [
    {
        id: '1',
        text: 'What services do you offer?',
        icon: '🎯'
    },
    {
        id: '2',
        text: 'How can I contact support?',
        icon: '📞'
    },
    {
        id: '3',
        text: 'Tell me about your pricing',
        icon: '💰'
    },
    {
        id: '4',
        text: 'How do I get started?',
        icon: '🚀'
    }
];
// Welcome message shown when chat starts
const WELCOME_MESSAGE = {
    id: 'welcome',
    role: 'assistant',
    content: `👋 Hello! I'm Knowrex, your intelligent customer support assistant.

I'm here to help you with any questions about our products, services, or general inquiries. Feel free to ask me anything!

Here are some things I can help you with:
• Answer questions about products and services
• Provide information and recommendations
• Help troubleshoot common issues
• Guide you through processes

What would you like to know today?`,
    timestamp: new Date()
};
function ChatPage() {
    _s();
    // ============================================
    // State Management
    // ============================================
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSearching, setIsSearching] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isDarkMode, setIsDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [documentsCount, setDocumentsCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [documents, setDocuments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pendingEscalations, setPendingEscalations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // RAG settings
    const { settings: ragSettings, setSettings: setRagSettings, isLoaded: ragSettingsLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$RAGSettings$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRAGSettings"])();
    // Ref for auto-scrolling to the latest message
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const chatContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ============================================
    // Load messages from localStorage on mount
    // ============================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            // Check for saved dark mode preference
            const savedDarkMode = localStorage.getItem('knowrex-dark-mode');
            if (savedDarkMode === 'true') {
                setIsDarkMode(true);
                document.documentElement.classList.add('dark');
            }
            // Load chat history from localStorage
            const loadMessages = {
                "ChatPage.useEffect.loadMessages": async ()=>{
                    try {
                        const savedMessages = localStorage.getItem(STORAGE_KEY);
                        if (savedMessages) {
                            const parsedMessages = JSON.parse(savedMessages);
                            // Restore dates from strings
                            const restoredMessages = parsedMessages.map({
                                "ChatPage.useEffect.loadMessages.restoredMessages": (msg)=>({
                                        ...msg,
                                        timestamp: new Date(msg.timestamp)
                                    })
                            }["ChatPage.useEffect.loadMessages.restoredMessages"]);
                            // Check for unresolved escalations and load resolved ones
                            const pendingEscIds = new Set();
                            const messagesToAdd = [];
                            const humanResponseIds = new Set(); // Track human responses already added
                            for (const msg of restoredMessages){
                                // Skip if this is a human response that we'll re-fetch
                                if (msg.id?.startsWith('human-')) {
                                    humanResponseIds.add(msg.id);
                                    continue; // We'll add fresh version from API
                                }
                                messagesToAdd.push(msg);
                                // If this message has an escalation ID, check its status
                                if (msg.escalationId) {
                                    try {
                                        const response = await fetch(`/api/escalations/${msg.escalationId}`);
                                        const data = await response.json();
                                        if (data.success) {
                                            if (data.escalation.status === 'resolved' && data.escalation.humanAnswer) {
                                                // Add human response - always add fresh from API
                                                const humanMsgId = `human-${msg.escalationId}`;
                                                messagesToAdd.push({
                                                    id: humanMsgId,
                                                    role: 'assistant',
                                                    content: `**🙋 Human Expert Response:**\n\n${data.escalation.humanAnswer}\n\n*Resolved by: ${data.escalation.resolvedBy}*`,
                                                    timestamp: new Date(data.escalation.resolvedAt),
                                                    usedRAG: false
                                                });
                                            } else if (data.escalation.status !== 'resolved' && data.escalation.status !== 'rejected') {
                                                // Still pending/in_progress, add to polling set
                                                pendingEscIds.add(msg.escalationId);
                                            }
                                        }
                                    } catch (error) {
                                        console.error(`Error checking escalation ${msg.escalationId}:`, error);
                                        // Add to pending in case of error to retry
                                        pendingEscIds.add(msg.escalationId);
                                    }
                                }
                            }
                            setMessages(messagesToAdd.length > 0 ? messagesToAdd : [
                                WELCOME_MESSAGE
                            ]);
                            setPendingEscalations(pendingEscIds);
                        } else {
                            setMessages([
                                WELCOME_MESSAGE
                            ]);
                        }
                    } catch (e) {
                        console.error('Failed to load chat history:', e);
                        setMessages([
                            WELCOME_MESSAGE
                        ]);
                    }
                }
            }["ChatPage.useEffect.loadMessages"];
            loadMessages();
            // Fetch documents count for RAG indicator
            fetchDocumentsCount();
            setIsInitialized(true);
        }
    }["ChatPage.useEffect"], []);
    // Fetch documents count
    const fetchDocumentsCount = async ()=>{
        try {
            const response = await fetch('/api/documents');
            if (response.ok) {
                const data = await response.json();
                const docsList = data.documents || [];
                setDocumentsCount(docsList.length);
                // Build DocumentOption list for the filter dropdown
                // Use originalName from the API (not 'name' which doesn't exist)
                setDocuments(docsList.map((doc)=>({
                        id: doc.id,
                        name: doc.originalName || doc.filename || 'Unnamed Document'
                    })));
            }
        } catch (e) {
            console.error('Failed to fetch documents count:', e);
        }
    };
    // ============================================
    // Save messages to localStorage when they change
    // ============================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (isInitialized && messages.length > 0) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
                } catch (e) {
                    console.error('Failed to save chat history:', e);
                }
            }
        }
    }["ChatPage.useEffect"], [
        messages,
        isInitialized
    ]);
    // ============================================
    // Auto-scroll to bottom when new messages arrive
    // ============================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }["ChatPage.useEffect"], [
        messages,
        isLoading
    ]);
    // ============================================
    // Poll for resolved escalations
    // ============================================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (pendingEscalations.size === 0) return;
            const checkEscalations = {
                "ChatPage.useEffect.checkEscalations": async ()=>{
                    const escalationsToCheck = Array.from(pendingEscalations);
                    for (const escalationId of escalationsToCheck){
                        try {
                            const response = await fetch(`/api/escalations/${escalationId}`);
                            const data = await response.json();
                            if (data.success && data.escalation.status === 'resolved' && data.escalation.humanAnswer) {
                                // Remove from pending first
                                setPendingEscalations({
                                    "ChatPage.useEffect.checkEscalations": (prev)=>{
                                        const next = new Set(prev);
                                        next.delete(escalationId);
                                        return next;
                                    }
                                }["ChatPage.useEffect.checkEscalations"]);
                                // Add human answer as new message (use functional update to get latest messages)
                                setMessages({
                                    "ChatPage.useEffect.checkEscalations": (prev)=>{
                                        // Check if human response already exists
                                        const humanResponseExists = prev.some({
                                            "ChatPage.useEffect.checkEscalations.humanResponseExists": (m)=>m.id === `human-${escalationId}`
                                        }["ChatPage.useEffect.checkEscalations.humanResponseExists"]);
                                        if (humanResponseExists) {
                                            return prev; // Don't add duplicate
                                        }
                                        const humanMessage = {
                                            id: `human-${escalationId}`,
                                            role: 'assistant',
                                            content: `**🙋 Human Expert Response:**\n\n${data.escalation.humanAnswer}\n\n*Resolved by: ${data.escalation.resolvedBy}*`,
                                            timestamp: new Date(data.escalation.resolvedAt),
                                            usedRAG: false
                                        };
                                        return [
                                            ...prev,
                                            humanMessage
                                        ];
                                    }
                                }["ChatPage.useEffect.checkEscalations"]);
                            }
                        } catch (error) {
                            console.error(`Error checking escalation ${escalationId}:`, error);
                        }
                    }
                }
            }["ChatPage.useEffect.checkEscalations"];
            // Poll every 5 seconds
            const interval = setInterval(checkEscalations, 5000);
            // Check immediately
            checkEscalations();
            return ({
                "ChatPage.useEffect": ()=>clearInterval(interval)
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        pendingEscalations
    ]);
    // ============================================
    // Toggle dark mode
    // ============================================
    const toggleDarkMode = ()=>{
        setIsDarkMode((prev)=>{
            const newValue = !prev;
            localStorage.setItem('bizassist-dark-mode', String(newValue));
            if (newValue) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newValue;
        });
    };
    // ============================================
    // Clear chat history
    // ============================================
    const clearChat = ()=>{
        setMessages([
            WELCOME_MESSAGE
        ]);
        setError(null);
        localStorage.removeItem(STORAGE_KEY);
    };
    // ============================================
    // Send message to API and handle streaming response with RAG
    // ============================================
    const sendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[sendMessage]": async (content)=>{
            // Clear any previous errors
            setError(null);
            // Create the user message
            const userMessage = {
                id: `user-${Date.now()}`,
                role: 'user',
                content,
                timestamp: new Date()
            };
            // Add user message to state
            setMessages({
                "ChatPage.useCallback[sendMessage]": (prev)=>[
                        ...prev,
                        userMessage
                    ]
            }["ChatPage.useCallback[sendMessage]"]);
            setIsLoading(true);
            // Show searching indicator if RAG is enabled
            if (ragSettings.enabled) {
                setIsSearching(true);
            }
            try {
                // Prepare conversation history for the API
                // We exclude the welcome message and only send actual conversation
                const history = messages.filter({
                    "ChatPage.useCallback[sendMessage].history": (msg)=>msg.id !== 'welcome'
                }["ChatPage.useCallback[sendMessage].history"]).map({
                    "ChatPage.useCallback[sendMessage].history": (msg)=>({
                            role: msg.role,
                            content: msg.content
                        })
                }["ChatPage.useCallback[sendMessage].history"]);
                // Make the API call with streaming and RAG options
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: content,
                        history,
                        ragEnabled: ragSettings.enabled,
                        minConfidence: ragSettings.minConfidence,
                        selectedDocumentId: ragSettings.selectedDocumentId
                    })
                });
                setIsSearching(false);
                // Handle error responses
                if (!response.ok) {
                    let errorMessage = `Request failed with status ${response.status}`;
                    try {
                        const contentType = response.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            const errorData = await response.json();
                            errorMessage = errorData.error || errorMessage;
                        } else {
                            const errorText = await response.text();
                            if (errorText) {
                                errorMessage = errorText;
                            }
                        }
                    } catch (parseError) {
                        // If parsing fails, use the default error message
                        console.error('Failed to parse error response:', parseError);
                    // Keep the default errorMessage
                    }
                    // Set error state instead of throwing
                    setError(errorMessage);
                    setIsLoading(false);
                    return; // Exit early instead of throwing
                }
                // Create a placeholder for the AI response
                const assistantMessageId = `assistant-${Date.now()}`;
                const assistantMessage = {
                    id: assistantMessageId,
                    role: 'assistant',
                    content: '',
                    timestamp: new Date(),
                    usedRAG: undefined,
                    sources: undefined,
                    confidence: undefined,
                    escalation: undefined // Will be set from RAG metadata
                };
                // Add the empty assistant message
                setMessages({
                    "ChatPage.useCallback[sendMessage]": (prev)=>[
                            ...prev,
                            assistantMessage
                        ]
                }["ChatPage.useCallback[sendMessage]"]);
                // Read the streaming response
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                if (!reader) {
                    throw new Error('Failed to get response reader');
                }
                // Process the stream chunk by chunk
                let accumulatedContent = '';
                let ragMetadata = {};
                let metadataExtracted = false;
                while(true){
                    const { done, value } = await reader.read();
                    if (done) break;
                    // Decode the chunk and add to accumulated content
                    const chunk = decoder.decode(value, {
                        stream: true
                    });
                    accumulatedContent += chunk;
                    // Extract RAG metadata from the beginning of the response
                    if (!metadataExtracted && accumulatedContent.includes('__END_METADATA__')) {
                        const metadataMatch = accumulatedContent.match(/__RAG_METADATA__(.+?)__END_METADATA__/);
                        if (metadataMatch) {
                            try {
                                ragMetadata = JSON.parse(metadataMatch[1]);
                                console.log('[Frontend] Parsed RAG metadata:', ragMetadata);
                                console.log('[Frontend] usedRAG:', ragMetadata.usedRAG, 'sources:', ragMetadata.sources?.length);
                                if (ragMetadata.escalation) {
                                    console.log('[Frontend] Escalation info:', ragMetadata.escalation);
                                }
                            } catch (e) {
                                console.error('Failed to parse RAG metadata:', e);
                            }
                            // Remove metadata from content
                            accumulatedContent = accumulatedContent.replace(/__RAG_METADATA__.+?__END_METADATA__/, '');
                            metadataExtracted = true;
                        }
                    }
                    // Update the message content with the accumulated text (without metadata)
                    const displayContent = accumulatedContent.replace(/__RAG_METADATA__.+?__END_METADATA__/, '');
                    setMessages({
                        "ChatPage.useCallback[sendMessage]": (prev)=>prev.map({
                                "ChatPage.useCallback[sendMessage]": (msg)=>msg.id === assistantMessageId ? {
                                        ...msg,
                                        content: displayContent,
                                        usedRAG: ragMetadata.usedRAG,
                                        sources: ragMetadata.sources,
                                        confidence: ragMetadata.confidence,
                                        escalation: ragMetadata.escalation
                                    } : msg
                            }["ChatPage.useCallback[sendMessage]"])
                    }["ChatPage.useCallback[sendMessage]"]);
                }
            } catch (err) {
                // Handle errors gracefully
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
                setError(errorMessage);
                // Log error in development
                if ("TURBOPACK compile-time truthy", 1) {
                    console.error('Chat error:', err);
                }
            } finally{
                setIsLoading(false);
                setIsSearching(false);
            }
        }
    }["ChatPage.useCallback[sendMessage]"], [
        messages,
        ragSettings
    ]);
    // ============================================
    // Handle sample question click
    // ============================================
    const handleSampleQuestion = (question)=>{
        if (!isLoading) {
            sendMessage(question);
        }
    };
    // ============================================
    // Handle escalation request
    // ============================================
    const handleEscalate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatPage.useCallback[handleEscalate]": async (message)=>{
            if (!message.escalation) return;
            // Find the user message that triggered this response
            const messageIndex = messages.findIndex({
                "ChatPage.useCallback[handleEscalate].messageIndex": (m)=>m.id === message.id
            }["ChatPage.useCallback[handleEscalate].messageIndex"]);
            const userMessage = messageIndex > 0 ? messages[messageIndex - 1] : null;
            try {
                const response = await fetch('/api/escalations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userQuestion: userMessage?.content || 'Unknown question',
                        context: messages.slice(Math.max(0, messageIndex - 5), messageIndex + 1).map({
                            "ChatPage.useCallback[handleEscalate]": (m)=>({
                                    role: m.role,
                                    content: m.content,
                                    timestamp: m.timestamp
                                })
                        }["ChatPage.useCallback[handleEscalate]"]),
                        attemptedAnswer: message.content,
                        confidenceScore: message.confidence || 0,
                        documentsSearched: message.sources?.length || 0,
                        topMatchScore: message.sources?.[0]?.score || 0,
                        sourcesFound: message.sources?.map({
                            "ChatPage.useCallback[handleEscalate]": (s)=>({
                                    documentName: s.documentName,
                                    chunkId: s.chunkId,
                                    score: s.score,
                                    text: s.text.substring(0, 500)
                                })
                        }["ChatPage.useCallback[handleEscalate]"]) || [],
                        reason: message.escalation.reason,
                        urgency: message.escalation.urgency
                    })
                });
                const data = await response.json();
                if (data.success) {
                    // Update the message with escalation ID
                    setMessages({
                        "ChatPage.useCallback[handleEscalate]": (prev)=>prev.map({
                                "ChatPage.useCallback[handleEscalate]": (m)=>m.id === message.id ? {
                                        ...m,
                                        escalationId: data.escalation.id
                                    } : m
                            }["ChatPage.useCallback[handleEscalate]"])
                    }["ChatPage.useCallback[handleEscalate]"]);
                    // Add to pending escalations for polling
                    setPendingEscalations({
                        "ChatPage.useCallback[handleEscalate]": (prev)=>new Set(prev).add(data.escalation.id)
                    }["ChatPage.useCallback[handleEscalate]"]);
                } else {
                    throw new Error(data.error || 'Failed to create escalation');
                }
            } catch (error) {
                console.error('Escalation error:', error);
                throw error;
            }
        }
    }["ChatPage.useCallback[handleEscalate]"], [
        messages
    ]);
    // ============================================
    // Render the chat interface
    // ============================================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-screen",
        style: {
            backgroundColor: 'var(--background)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "flex items-center justify-between px-4 py-3 border-b shadow-sm",
                style: {
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                    className: "w-6 h-6 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 575,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                lineNumber: 574,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "font-semibold text-lg",
                                        style: {
                                            color: 'var(--foreground)'
                                        },
                                        children: "Knowrex"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                        lineNumber: 578,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs",
                                        style: {
                                            color: 'var(--muted)'
                                        },
                                        children: "Intelligent Customer Support"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                        lineNumber: 581,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                lineNumber: 577,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                        lineNumber: 572,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/admin",
                                className: "p-2 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-gray-500",
                                style: {
                                    color: 'var(--muted)'
                                },
                                title: "Admin Dashboard",
                                "aria-label": "Admin Dashboard",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 597,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                lineNumber: 590,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearChat,
                                className: "p-2 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-gray-500",
                                style: {
                                    color: 'var(--muted)'
                                },
                                title: "Clear chat history",
                                "aria-label": "Clear chat history",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 608,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                lineNumber: 601,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleDarkMode,
                                className: "p-2 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-gray-500",
                                style: {
                                    color: 'var(--muted)'
                                },
                                title: isDarkMode ? 'Switch to light mode' : 'Switch to dark mode',
                                "aria-label": isDarkMode ? 'Switch to light mode' : 'Switch to dark mode',
                                children: isDarkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 620,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 622,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                lineNumber: 612,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                        lineNumber: 588,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                lineNumber: 565,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                ref: chatContainerRef,
                className: "flex-1 overflow-y-auto px-4 py-6 custom-scrollbar",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-4xl mx-auto space-y-6",
                    children: [
                        messages.length <= 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 rounded-xl border",
                                            style: {
                                                backgroundColor: 'var(--card-bg)',
                                                borderColor: 'var(--border-color)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                        className: "w-5 h-5 text-indigo-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                        lineNumber: 649,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 648,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-medium mb-1",
                                                    style: {
                                                        color: 'var(--foreground)'
                                                    },
                                                    children: "Instant Responses"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 651,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    style: {
                                                        color: 'var(--muted)'
                                                    },
                                                    children: "Get answers in real-time with AI-powered support"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                            lineNumber: 641,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 rounded-xl border",
                                            style: {
                                                backgroundColor: 'var(--card-bg)',
                                                borderColor: 'var(--border-color)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                        className: "w-5 h-5 text-purple-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                        lineNumber: 667,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-medium mb-1",
                                                    style: {
                                                        color: 'var(--foreground)'
                                                    },
                                                    children: "Natural Conversation"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 669,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    style: {
                                                        color: 'var(--muted)'
                                                    },
                                                    children: "Chat naturally like you would with a human agent"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 672,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                            lineNumber: 659,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 rounded-xl border",
                                            style: {
                                                backgroundColor: 'var(--card-bg)',
                                                borderColor: 'var(--border-color)'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                                        className: "w-5 h-5 text-emerald-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                        lineNumber: 685,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-medium mb-1",
                                                    style: {
                                                        color: 'var(--foreground)'
                                                    },
                                                    children: "24/7 Available"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 687,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    style: {
                                                        color: 'var(--muted)'
                                                    },
                                                    children: "Get help anytime, day or night"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                    lineNumber: 690,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                            lineNumber: 677,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 640,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-medium",
                                        style: {
                                            color: 'var(--muted)'
                                        },
                                        children: "Try asking one of these questions:"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                        lineNumber: 698,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 697,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                    children: SAMPLE_QUESTIONS.map((question)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>handleSampleQuestion(question.text),
                                            disabled: isLoading,
                                            className: "p-4 rounded-xl border text-left transition-all duration-200 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed group",
                                            style: {
                                                backgroundColor: 'var(--card-bg)',
                                                borderColor: 'var(--border-color)'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-2xl",
                                                        children: question.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                        lineNumber: 715,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium group-hover:text-indigo-500 transition-colors",
                                                        style: {
                                                            color: 'var(--foreground)'
                                                        },
                                                        children: question.text
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                        lineNumber: 716,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                                lineNumber: 714,
                                                columnNumber: 21
                                            }, this)
                                        }, question.id, false, {
                                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                            lineNumber: 704,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 702,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                            lineNumber: 638,
                            columnNumber: 13
                        }, this),
                        messages.map((message, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$ChatMessage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                message: message,
                                isLatest: index === messages.length - 1,
                                showSources: ragSettings.showSources,
                                onEscalate: handleEscalate
                            }, message.id, false, {
                                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                lineNumber: 731,
                                columnNumber: 13
                            }, this)),
                        isSearching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-sm py-2 px-3 rounded-lg message-enter",
                            style: {
                                backgroundColor: 'var(--ai-bubble)',
                                color: 'var(--muted)',
                                width: 'fit-content'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"], {
                                    className: "w-4 h-4 text-indigo-500 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 750,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Searching documents..."
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 751,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                            lineNumber: 742,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$TypingIndicator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            isVisible: isLoading && !isSearching
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                            lineNumber: 754,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 p-4 rounded-xl border message-enter",
                            style: {
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                borderColor: 'var(--error)',
                                color: 'var(--error)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                    className: "w-5 h-5 flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 766,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-medium",
                                            children: "Something went wrong"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                            lineNumber: 768,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm opacity-90",
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                            lineNumber: 769,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                                    lineNumber: 767,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                            lineNumber: 758,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: messagesEndRef
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                            lineNumber: 775,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                    lineNumber: 635,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                lineNumber: 631,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-4 pb-2 max-w-4xl mx-auto w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$RAGSettings$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    settings: ragSettings,
                    onSettingsChange: setRagSettings,
                    isSearching: isSearching,
                    documentsCount: documentsCount,
                    documents: documents
                }, void 0, false, {
                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                    lineNumber: 783,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                lineNumber: 782,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSendMessage: sendMessage,
                isLoading: isLoading
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                lineNumber: 795,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "text-center py-2 text-xs border-t",
                style: {
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--muted)'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                            className: "w-3 h-3"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                            lineNumber: 812,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Powered by Google Gemini AI"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/knowrex/app/page.tsx",
                            lineNumber: 813,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/knowrex/app/page.tsx",
                    lineNumber: 811,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/knowrex/app/page.tsx",
                lineNumber: 803,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/knowrex/app/page.tsx",
        lineNumber: 558,
        columnNumber: 5
    }, this);
}
_s(ChatPage, "rj30JOCIYZfgJUciTh8WtjCgu18=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$knowrex$2f$components$2f$RAGSettings$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRAGSettings"]
    ];
});
_c = ChatPage;
var _c;
__turbopack_context__.k.register(_c, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_knowrex_494f88ad._.js.map